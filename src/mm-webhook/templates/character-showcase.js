const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CHANNEL_ID = '1439345698398015548';

function loadCharacters() {
    const dataPath = path.join(__dirname, '..', 'data', 'gitmon-characters.json');
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function createCharacterEmbed(character) {
    return {
        embeds: [{
            title: `${character.emoji} **${character.name.toUpperCase()}**`,
            description: character.description,
            color: parseInt(character.color),
            fields: [
                {
                    name: "Type",
                    value: `${character.emoji} ${character.type.toUpperCase()}`,
                    inline: true
                }
            ],
            footer: {
                text: "GitMon Universe • Character Showcase"
            }
        }]
    };
}

async function sendCharacterShowcase(webhookUrl) {
    const characters = loadCharacters();

    console.log(`Sending character showcase for ${characters.length} GitMons...`);

    for (const character of characters) {
        const embed = createCharacterEmbed(character);

        try {
            await axios.post(webhookUrl, embed);
            console.log(`✅ Sent: ${character.name} (${character.type})`);

            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error(`❌ Failed to send ${character.name}:`, error.message);
        }
    }

    console.log('🎉 Character showcase complete!');
}

module.exports = {
    sendCharacterShowcase,
    createCharacterEmbed,
    loadCharacters,
    CHANNEL_ID
};