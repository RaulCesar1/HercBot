const {client} = require('../index.js')

async function rStatus() {
    const status = [
        `Bot criado por Luar#8567`,
        `Digite "/" e veja meus comandos!`,
    ]

    let raStatus = Math.floor(Math.random() * status.length)
    client.user.setActivity(status[raStatus])
}

exports.rStatus = rStatus