require('dotenv').config()
const { Client } = require('discord.js')
const { connect } = require('mongoose')

module.exports = class extends Client {
    constructor() {
        super({ intents: 3276799 })
    }

    login() {
        super.login(process.env.TOKEN)
    }

    mongoConnect() {
        connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log('Conectado ao MongoDB')
        })
    }
}