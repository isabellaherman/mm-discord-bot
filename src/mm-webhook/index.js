const { sendCharacterShowcase } = require('./templates/character-showcase');

async function runCharacterShowcase(webhookUrl) {
    if (!webhookUrl) {
        console.error('❌ Webhook URL is required');
        console.log('Usage: node src/mm-webhook/index.js <webhook-url>');
        process.exit(1);
    }

    try {
        await sendCharacterShowcase(webhookUrl);
    } catch (error) {
        console.error('❌ Character showcase failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    const webhookUrl = process.argv[2];
    runCharacterShowcase(webhookUrl);
}

module.exports = {
    runCharacterShowcase,
    sendCharacterShowcase
};