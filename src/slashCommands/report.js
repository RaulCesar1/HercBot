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