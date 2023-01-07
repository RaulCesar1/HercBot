require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('csgo')
		.setDescription('Comandos relacionados ao jogo CS:GO.')
		.addSubcommand((sub) =>
			sub
				.setName('mercado')
				.setDescription('Realiza uma pesquisa no Mercado da Comunidade Steam do CS:GO.')
				.addStringOption((option) =>
					option
					.setName('item')
					.setDescription('O item que está procurando.')
					.setRequired(true)
				)
		),
	async execute(interaction, client) {
		if (interaction.options._subcommand === 'mercado') {
			await interaction.deferReply({ ephemeral: true })
			let item = interaction.options.get('item').value

			let url = `https://steamcommunity.com/market/search/render/?query=${item}&norender=1&l=english&appid=730`
			var req = await axios.get(url)
			req = req.data

			if (req.results.length <= 0) return interaction.editReply(`Item não encontrado!`)

			var items = []

			for (let i = 0; i < req.results.length; i++) {
				let market_steam_url =
					`https://steamcommunity.com/market/listings/730/${req.results[i].hash_name}?l=english`
						.replace('|', '%7C')
						.replaceAll(' ', '%20')

				items.push(
					`
					**[${req.results[i].name}](${market_steam_url})** 
					\`Oferta: ${req.results[i].sell_price_text}\`
					\`Preço Médio: ${req.results[i].sale_price_text}\`
					`
				)
			}

			let embed = new EmbedBuilder()
				.setDescription(items.join(' '))
				.setColor('Blurple')
				.setAuthor({ name: `Resultados para "${item}"` })

			try {
				interaction.editReply({ embeds: [embed] })
			} catch(e) {
				console.log(e)
			}
		}
	},
}
