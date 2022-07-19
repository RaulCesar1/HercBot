require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Mostra o ping do bot'),
	async execute(interaction, client) {
        let embed_ping = new EmbedBuilder()
        .setDescription(`**Ping do bot: \`${client.ws.ping}ms\`**`)
        .setColor('Aqua')

        interaction.reply({ embeds: [embed_ping] })
	},
};