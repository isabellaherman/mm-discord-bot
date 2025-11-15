require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { neon } = require('@neondatabase/serverless');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const sql = neon(process.env.DATABASE_URL);
const TRAINERS_ROLE_ID = '1438565871025913966';

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

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await updateCategoryName();
    await assignTrainerRoleToExistingMembers();
});

client.login(process.env.DISCORD_TOKEN);