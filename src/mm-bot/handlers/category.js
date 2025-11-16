const sql = require('../../shared/database');

async function updateCategoryName(client) {
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

module.exports = {
    updateCategoryName
};