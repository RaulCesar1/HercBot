require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Mostra o tempo que o bot está ligado'),
	async execute(interaction, client) {
        function converter_horas(tempo) {
			var horas = Math.floor(tempo / 3600);
			var minutos = Math.floor((tempo - horas * 3600) / 60);
			var segundos = tempo - horas * 3600 - minutos * 60;
			segundos = Math.floor(segundos);

			if (horas < 10) {
				horas = '0' + horas;
			}
			if (minutos < 10) {
				minutos = '0' + minutos;
			}
			if (segundos < 10) {
				segundos = '0' + segundos;
			}
			return horas + ':' + minutos + ':' + segundos;
		}

		const uptime = converter_horas(process.uptime());

		const embed_uptime = new EmbedBuilder()
			.setAuthor({ name: uptime })
			.setColor('Aqua');

		interaction.reply({ embeds: [embed_uptime] });
	},
};