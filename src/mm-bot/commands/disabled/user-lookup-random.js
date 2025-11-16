// Check a user in the database and returns random response regardless of their level

const { SlashCommandBuilder } = require('discord.js');
const sql = require('../../shared/database');

function getRandomMadMonkeyResponse(username, level, xp) {
    const allTaunts = [
        `${username} | Level ${level} | ${xp} XP\n\nYeah, the world needs side characters too.`,
        `${username} | Level ${level} | ${xp} XP\n\nYou showed up with that XP? Bold.`,
        `${username} | Level ${level} | ${xp} XP\n\nMid level is cute. Like training wheels for combat.`,
        `${username} | Level ${level} | ${xp} XP\n\nCongrats! You've graduated from noob to slightly-less-noob!`,
        `${username} | Level ${level} | ${xp} XP\n\nI feel you can get dangerous... I'll keep my eye on you.`,
        `${username} | Level ${level} | ${xp} XP\n\nYou're not supposed to be this strong.`,
        `${username} | Level ${level} | ${xp} XP\n\nIf you surpass me, I will personally rewrite the leaderboard.`
    ];

    return allTaunts[Math.floor(Math.random() * allTaunts.length)];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random-trainer')
        .setDescription('Check a trainer\'s stats with random Mad Monkey response')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The trainer\'s GitHub username to look up')
                .setRequired(true)
        ),

    async execute(interaction) {
        const username = interaction.options.getString('username');

        try {
            const result = await sql`
                SELECT "githubUsername", level, xp
                FROM users
                WHERE LOWER("githubUsername") = LOWER(${username})
                LIMIT 1
            `;

            if (result.length === 0) {
                await interaction.reply({
                    content: `How dare you call yourself a trainer? You either can't type your own username, or you never registered at https://gitmon.xyz`
                });
                return;
            }

            const trainer = result[0];
            const response = getRandomMadMonkeyResponse(trainer.githubUsername, trainer.level, trainer.xp);

            await interaction.reply({
                content: `${response}`
            });

        } catch (error) {
            console.error('Error fetching trainer data:', error);
            console.error('Full error details:', error.message);
            await interaction.reply({
                content: `My database is acting up! Even I can't hack through this chaos right now. Try again later. 💥\n\n*Debug: ${error.message}*`
            });
        }
    }
};