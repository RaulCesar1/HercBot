const { client } = require('../index.js')
const Guild = require('../models/Guild.js')

async function loadGuilds() {
    const guildIds = client.guilds.cache.map(guild => guild.id)
    guildIds.forEach(async guildId => {
        let guildDB = await Guild.findOne({ _id: guildId })
        if(!guildDB) {
            await new Guild({ _id: guildId }).save()
            await console.log(`Servidor criado na database: ${guildId}`)
        }
    })
}

exports.loadGuilds = loadGuilds