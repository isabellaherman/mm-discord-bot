const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

function loadGitMons() {
    const dataPath = path.join(__dirname, '..', '..', 'mm-webhook', 'data', 'gitmon-characters.json');
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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gitdex')
        .setDescription('Display the complete GitMon character collection'),

    async execute(interaction) {
        const embed = createGitdexEmbed();
        await interaction.reply({ embeds: [embed] });
    }
};