const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {
        console.log(`✅ ${client.user.tag} está en línea.`);

        client.user.setPresence({
            status: 'online',
            activities: [
                {
                    name: 'ULTIME TICKET',
                    type: ActivityType.Watching
                }
            ]
        });
    }
};
