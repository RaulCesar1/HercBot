require('dotenv').config()

const { Client, Collection, ChannelType } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

const fs = require('fs')

const { connect } = require('mongoose')

const client = new Client({ intents: 3276799 })

// Slash Command Handler

const commandFiles = fs.readdirSync('./src/comandos').filter((file) => file.endsWith('.js'));
const commands = [];
client.commands = new Collection();

for (let file of commandFiles) {
	let command = require(`./comandos/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

// Evento "ready"

client.on('ready', async() => {

	// Carregar Comandos

	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

	await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
		body: commands
	})
	console.log('Comandos carregados:\n')
	for(let comando of commands) {
		console.log(comando.name)
	}
	console.log('\n')

	// Função alterar presença do bot

	function rStatus() {
		let status = [
			`/ajuda`,
		];

		let raStatus = Math.floor(Math.random() * status.length);
		client.user.setActivity(status[raStatus]);
	}
	setInterval(rStatus, 10000);
})

// Evento "interactionCreate"

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	if (interaction.user.bot === true) return;

	let command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'Ocorreu um erro ao executar este comando!',
			ephemeral: true,
		});
	}
});

// Evento "messageCreate"

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (message.channel.type === ChannelType.DM) return;

	if (message.content.startsWith(`<@${client.user.id}>`)) {
		message.reply({
		  content: `Quer saber meus comandos? Utilize \`/ajuda\``,
		});
	  }
})

client.login(process.env.TOKEN)