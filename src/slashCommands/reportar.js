require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reportar')
		.setDescription('Comando para reportar um problema ou enviar uma sugestão (Sobre o bot)')
		.addStringOption(option => 
			option
			.setName('report')
			.setDescription('Problema ou sugestão que está reportando.')
			.setRequired(true)
		),
	async execute(interaction, client) {
		client.channels.cache.get(process.env.CANAL_REPORTS)
		.send({embeds: [
			new EmbedBuilder()
				.setColor('Blurple')
				.setDescription(interaction.options.get('report').value)
				.setFooter({ text: `Report por ${interaction.user.tag} | ${interaction.user.id}`, iconURL: interaction.user.avatarURL() })
				.setTimestamp()
		]})
		.then(() => { interaction.reply({ content: `Enviado! Obrigado **${interaction.user.username}**!`, ephemeral: true }) })
	},
};