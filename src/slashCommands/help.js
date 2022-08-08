require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const fs = require('fs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Help')
		.addStringOption((option) =>
			option.setName('command').setDescription('command').setRequired(false)
		),
	async execute(interaction, client, lf) {
		const commandList = []

		const comandos = fs.readdirSync('./src/slashCommands').filter((file) => file.endsWith('.js'))
		for (const comando of comandos) {
			commandList.push(comando.replace('.js', ' '))
		}

		const embed_ajuda_geral = new EmbedBuilder()
			.setColor('Aqua')
			.setDescription(lf['help_1'])
			.addFields([{ name: lf['help_2'], value: commandList.join('\n') }])

		if (!interaction.options.get('command')) return interaction.reply({ embeds: [embed_ajuda_geral], ephemeral: true })

		const getInputCommand = interaction.options.get('command').value
		const getClientCommand = client.commands.get(getInputCommand)

		if (!getClientCommand || getClientCommand === undefined)
		return interaction.reply({content: lf['help_3'].replace('{command}', getInputCommand), ephemeral: true })

		const commandDescription = lf[`${getInputCommand}_desc`]

		let embed_ajuda_comando = new EmbedBuilder()
			.setColor('Aqua')
			.setDescription(`**${commandDescription}**`)

		interaction.reply({ embeds: [embed_ajuda_comando], ephemeral: true })
	},
}
