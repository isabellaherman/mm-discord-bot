const TRAINERS_ROLE_ID = '1438565871025913966';

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

async function assignTrainerRoleToExistingMembers(client) {
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

function setupRoleHandlers(client) {
    client.on('guildMemberAdd', async (member) => {
        await assignTrainerRole(member);
    });
}

module.exports = {
    assignTrainerRole,
    assignTrainerRoleToExistingMembers,
    setupRoleHandlers
};