require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const axios = require('axios')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('csgo')
		.setDescription('CS:GO related commands.')
		.setDescriptionLocalizations({
			"pt-BR": "Comandos relacionados ao CS:GO."
		})
		.addSubcommand((sub) =>
			sub
				.setName('market')
				.setDescription('Do a search on the CS:GO Steam Community Market.')
				.setNameLocalizations({
					"pt-BR": "mercado"
				})
				.setDescriptionLocalizations({
					"pt-BR": "Realiza uma pesquisa no Mercado da Comunidade Steam do CS:GO."
				})
				.addStringOption((option) =>
					option
					.setName('item')
					.setDescription('The item you are looking for.')
					.setDescriptionLocalizations({
						"pt-BR": "O item que está procurando."
					})
					.setRequired(true)
				)
		),
	async execute(interaction, client, lf) {
		if (interaction.options._subcommand === 'market') {
			await interaction.deferReply({ ephemeral: true })
			let item = interaction.options.get('item').value

			let url = `https://steamcommunity.com/market/search/render/?query=${item}&norender=1&l=english&appid=730`
			var req = await axios.get(url)
			req = req.data

			if (req.results.length <= 0) return interaction.reply(lf["csgo_1"])

			var items = []

			for (let i = 0; i < req.results.length; i++) {
				let market_steam_url =
					`https://steamcommunity.com/market/listings/730/${req.results[i].hash_name}?l=english`
						.replace('|', '%7C')
						.replaceAll(' ', '%20')

				items.push(
					`
					**[${req.results[i].name}](${market_steam_url})** 
					\`${lf["csgo_2"]} ${req.results[i].sell_price_text}\`
					\`${lf["csgo_3"]} ${req.results[i].sale_price_text}\`
					`
				)
			}

			let embed = new EmbedBuilder()
				.setDescription(items.join(' '))
				.setColor('Aqua')
				.setAuthor({ name: lf["csgo_4"].replace('{item}', item) })

			try {
				interaction.editReply({ embeds: [embed] })
			} catch(e) {
				console.log(e)
			}
		}
	},
}
