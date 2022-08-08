require('dotenv').config()

const { Client, Collection, ChannelType } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

const fs = require('fs')
const async = require('async')

const client = new Client({ intents: 3276799 })

// Command Handler

const directories = [
	`${__dirname}\\slashCommands`, 
	`${__dirname}\\contextMenu`
]

const commands = []
client.commands = new Collection()

function tipos(type) {
	switch(type) {
		case 2:
		case 3:
			return 'Context Menu'
		case undefined:
			return 'Slash Command'
		default:
			return 'Unknown'
	}
}

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
				client.commands.set(command.data.name, command)
				console.log(`\x1b[32m[${tipos(command.data.type)}] \x1b[33m${command.data.name}`)
			})

			callback()
		})
	},
	(err) => {
		if (err) console.error(err)
	}
)

// Evento "ready"

client.on('ready', async () => {
	// Carregar Comandos

	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

	await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
		body: commands,
	})

	// Função alterar presença do bot

	function rStatus() {
		let status = [
			`Bot created by Luar#8567`,
			`Use /help to see my commands!`,
		]

		let raStatus = Math.floor(Math.random() * status.length)
		client.user.setActivity(status[raStatus])
	}
	setInterval(rStatus, 10000)
})

// Evento "interactionCreate"

client.on('interactionCreate', async (interaction) => {
	// Language File

	try {
		var lf = require(`./lang/${interaction.locale}.json`)
	} catch (e) {
		if (!lf) lf = require(`./lang/en-US.json`)
	}

	if (interaction.user.bot === true) return

	if (!interaction.isChatInputCommand() && !interaction.isContextMenuCommand())
		return

	let command = client.commands.get(interaction.commandName)

	if (!command) return

	// Executar Comando

	try {
		await command.execute(interaction, client, lf)
	} catch (error) {
		console.error(error)
		await interaction.reply({
			content: 'Ocorreu um erro ao executar este comando!',
			ephemeral: true,
		})
	}
})

client.login(process.env.TOKEN)

/* // MongoDB
const { conectar } = require('./mongoDB')
conectar() */