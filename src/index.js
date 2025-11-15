require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { neon } = require('@neondatabase/serverless');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const sql = neon(process.env.DATABASE_URL);

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

client.once('clientReady', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await updateCategoryName();
});

client.login(process.env.DISCORD_TOKEN);