require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const aid = process.env.AID

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changelog')
		.setDescription("Shows the bot's patch notes.")
		.setNameLocalizations({
            "pt-BR": "notas"
        })
		.setDescriptionLocalizations({
			"pt-BR": "Mostra as notas de atualização do bot.",
		})
		.addIntegerOption((option) =>
			option
				.setName('id')
				.setDescription(`The ID of a previous patch note.`)
				.setDescriptionLocalizations({
					"pt-BR": "O ID de uma nota de atualização anterior."
				})
				.setMinValue(1)
				.setMaxValue(parseInt(aid, 10))
		),
	async execute(interaction, client, lf) {
        try {
            var notas = require(`../lang/changelog/changelog_${interaction.locale}.json`)
        } catch (e) {
            if (!notas) notas = require(`../lang/changelog/changelog_en-US.json`)
        }

		const id = interaction.options.get('id')?.value || aid
		
		const nota = notas.ids.find((it) => it.id == id)

		try {
			interaction.reply({embeds: [
				new EmbedBuilder()
				.setColor('Yellow')
				.setAuthor({
					name: lf["changelog_2"],
					iconURL: client.user.avatarURL(),
				})
				.addFields([
					{
						name: `${lf["changelog_3"]} ${nota.version} (${nota.data})`,
						value: nota.desc,
					},
				])
				.setFooter({
					text: lf["changelog_4"]
                        .replace('{nota.id}', nota.id)
                        .replace('{aid}', aid),
				})
			]})
		} catch (e) {
			console.log(e)
		}
	},
}