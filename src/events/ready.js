const { carregarComandos } = require('../commandHandler.js')

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        carregarComandos()
    
        function rStatus() {
            let status = [
                `Bot created by Luar#8567`,
                `Use /help to see my commands!`,
            ]
    
            let raStatus = Math.floor(Math.random() * status.length)
            client.user.setActivity(status[raStatus])
        }
        setInterval(rStatus, 10000)
	},
};