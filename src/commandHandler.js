require('dotenv').config()
const tipos = require('./utils/tipos.js')
const fs = require('fs')
const async = require('async')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')
const { Collection } = require('discord.js')
const commandos = new Collection()
const directories = [
    `${__dirname}/slashCommands`, 
    `${__dirname}/contextMenu`
]
const commands = []
async function commandHandler() {
    async.each(
        directories,
        (directory, callback) => {
            console.log(`Carregando comandos no diretório ${directory}`)
            fs.readdir(directory, (err, files) => {
                if (err) return callback(err)
    
                files.forEach((file) => {
                    if (!file.endsWith('.js')) return
    
                    const command = require(`${directory}/${file}`)
                    commands.push(command.data.toJSON())
                    commandos.set(command.data.name, command)
                    console.log(`\x1b[32m[${tipos(command.data.type)}] \x1b[33m${command.data.name}`)
                })
    
                callback()
            })
        },
        (err) => {
            if (err) console.error(err)
        }
    )
}
async function carregarComandos() {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

	await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
		body: commands,
	})
}
exports.commandHandler = commandHandler
exports.carregarComandos = carregarComandos
exports.commandos = commandos