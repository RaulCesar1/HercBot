require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Ping'),
	async execute(interaction, client, lf) {
        interaction.reply({embeds: [
			new EmbedBuilder()
				.setDescription(lf['ping_1'].replace('{bot_ping}', client.ws.ping))
				.setColor('Aqua')
		]})
	},
};