require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reportar')
		.setDescription('Comando para reportar um problema ou uma sugestão')
		.addStringOption(option => 
			option
			.setName('report')
			.setDescription('Problema ou sugestão que deseja reportar')
			.setRequired(true)
		),
	async execute(interaction, client) {
		let embed_novo_report = new EmbedBuilder()
		.setColor('Aqua')
		.setAuthor({ name: 'Novo report!' })
		.setDescription(interaction.options.get('report').value)
		.setFooter({ text: `Report por ${interaction.user.tag} | ${interaction.user.id}`, iconURL: interaction.user.avatarURL() })

		client.channels.cache.get(process.env.CANAL_REPORTS)
		.send({ embeds: [embed_novo_report] })
		.then(() => { interaction.reply({ content: `Enviado! Obrigado **${interaction.user.username}**!`, ephemeral: true }) })
	},
};