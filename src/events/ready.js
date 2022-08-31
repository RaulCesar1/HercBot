require('dotenv').config()
const { carregarComandos } = require('../commandHandler.js')
const { loadGuilds } = require('../utils/loadGuilds.js')

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        carregarComandos()
        setInterval(loadGuilds, 1000 * 6)
    
        function rStatus() {
            let status = [
                `Bot created by Luar#8567`,
                `Type a "/" and see my commands!`,
            ]
    
            let raStatus = Math.floor(Math.random() * status.length)
            client.user.setActivity(status[raStatus])
        }
        setInterval(rStatus, 10000)
	},
};