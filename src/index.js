require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder } = require('discord.js');
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const sql = neon(process.env.DATABASE_URL);
const TRAINERS_ROLE_ID = '1438565871025913966';

function loadGitMons() {
    const dataPath = path.join(__dirname, 'mm-webhook', 'data', 'gitmon-characters.json');
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function createGitdexEmbed() {
    const gitmons = loadGitMons();
    const embed = new EmbedBuilder()
        .setTitle('📚 GitMon GitDex')
        .setDescription('Complete collection of GitMon characters')
        .setColor(0x7289DA)
        .setTimestamp();

    gitmons.forEach(gitmon => {
        const typeBox = `╭─ ${gitmon.type.toUpperCase()} ─╮`;
        embed.addFields({
            name: `${typeBox}\n${gitmon.name}`,
            value: gitmon.description,
            inline: true
        });
    });

    embed.setFooter({ text: 'GitMon Universe • Interactive GitDex' });
    return embed;
}


const commands = [
    new SlashCommandBuilder()
        .setName('gitdex')
        .setDescription('Display the complete GitMon character collection')
];

async function updateCategoryName() {
    try {
        const result = await sql`SELECT COUNT(*) as count FROM "users"`;
        const trainerCount = result[0].count;

        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const category = await guild.channels.fetch(process.env.CATEGORY_ID);

        const newName = `Trainers (${trainerCount})`;
        await category.setName(newName);

        console.log(`Updated category name to: ${newName}`);
    } catch (error) {
        console.error('Error updating category name:', error);
    }
}

async function assignTrainerRole(member) {
    try {
        if (!member.roles.cache.has(TRAINERS_ROLE_ID)) {
            await member.roles.add(TRAINERS_ROLE_ID);
            console.log(`Assigned Trainers role to ${member.user.tag}`);
        }
    } catch (error) {
        console.error(`Error assigning Trainers role to ${member.user.tag}:`, error);
    }
}

client.on('guildMemberAdd', async (member) => {
    await assignTrainerRole(member);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'gitdex') {
        const embed = createGitdexEmbed();
        await interaction.reply({ embeds: [embed] });
    }

});

async function assignTrainerRoleToExistingMembers() {
    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const members = await guild.members.fetch();

        let assigned = 0;
        for (const [, member] of members) {
            if (!member.user.bot && !member.roles.cache.has(TRAINERS_ROLE_ID)) {
                await assignTrainerRole(member);
                assigned++;
            }
        }

        console.log(`Assigned Trainers role to ${assigned} existing members`);
    } catch (error) {
        console.error('Error assigning Trainers role to existing members:', error);
    }
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

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await registerCommands();
    await updateCategoryName();
    await assignTrainerRoleToExistingMembers();
});

client.login(process.env.DISCORD_TOKEN);