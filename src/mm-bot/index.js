require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const { updateCategoryName } = require('./handlers/category');
const { assignTrainerRoleToExistingMembers, setupRoleHandlers } = require('./handlers/roles');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

async function registerCommands() {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Slash commands registered');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const commandsMap = {};
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        commandsMap[command.data.name] = command;
    }

    const command = commandsMap[interaction.commandName];
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('Error executing command:', error);
        await interaction.reply({
            content: 'There was an error executing this command!',
            ephemeral: true
        });
    }
});

setupRoleHandlers(client);

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await registerCommands();
    await updateCategoryName(client);
    await assignTrainerRoleToExistingMembers(client);
});

client.login(process.env.DISCORD_TOKEN);