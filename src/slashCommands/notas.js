require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const aid = process.env.AID

module.exports = {
	data: new SlashCommandBuilder()
		.setName('notas')
		.setDescription("Mostra as notas de atualização do bot.")
		.addIntegerOption((option) =>
			option
				.setName('id')
				.setDescription(`O ID de uma nota de atualização anterior.`)
				.setMinValue(1)
				.setMaxValue(parseInt(aid, 10))
		),
	async execute(interaction, client) {
		const notas = require(`../utils/notas.json`)

		const id = interaction.options.get('id')?.value || aid
		
		const nota = notas.ids.find((it) => it.id == id)

		try {
			interaction.reply({ ephemeral: true, embeds: [
				new EmbedBuilder()
				.setColor('Blurple')
				.setAuthor({
					name: "Notas de Atualização",
					iconURL: client.user.avatarURL(),
				})
				.setTitle(`Versão ${nota.version} (${nota.data})`)
				.setDescription(nota.desc)
				.setFooter({text: `Página ${nota.id} | Caso queira olhar outras notas de atualizações, use: /notas <1-${aid}>`})
			]})
		} catch (e) {
			console.log(e)
		}
	},
}