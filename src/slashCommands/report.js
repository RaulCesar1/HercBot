require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Command to report a problem or a suggestion.')
		.setNameLocalizations({
            "pt-BR": "reportar"
        })
		.setDescriptionLocalizations({
			"pt-BR": "Comando para reportar um problema ou uma sugestão."
		})
		.addStringOption(option => 
			option
			.setName('report')
			.setDescription('Problem or suggestion you are reporting.')
			.setNameLocalizations({
				"pt-BR": "reporte"
			})
			.setDescriptionLocalizations({
				"pt-BR": "O Problema ou sugestão que está reportando."
			})
			.setRequired(true)
		),
	async execute(interaction, client, lf) {
		client.channels.cache.get(process.env.CANAL_REPORTS)
		.send({embeds: [
			new EmbedBuilder()
				.setColor('Aqua')
				.setDescription(interaction.options.get('report').value)
				.setFooter({ text: `Report por ${interaction.user.tag} | ${interaction.user.id}`, iconURL: interaction.user.avatarURL() })
				.setTimestamp()
		]})
		.then(() => { interaction.reply({ content: lf['report_1'].replace('{user}', interaction.user.username), ephemeral: true }) })
	},
};