require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report')
		.addStringOption(option => 
			option
			.setName('report')
			.setDescription('Report')
			.setRequired(true)
		),
	async execute(interaction, client, lf) {
		let embed_novo_report = new EmbedBuilder()
		.setColor('Aqua')
		.setAuthor({ name: 'Novo report!' })
		.setDescription(interaction.options.get('report').value)
		.setFooter({ text: `Report por ${interaction.user.tag} | ${interaction.user.id}`, iconURL: interaction.user.avatarURL() })

		client.channels.cache.get(process.env.CANAL_REPORTS)
		.send({ embeds: [embed_novo_report] })
		.then(() => { interaction.reply({ content: lf['report_1'].replace('{user}', interaction.user.username), ephemeral: true }) })
	},
};