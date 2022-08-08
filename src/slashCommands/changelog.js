require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const aid = process.env.AID

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changelog')
		.setDescription('Changelog')
		.addStringOption((option) =>
			option
				.setName('id')
				.setDescription(`Id`)
		),
	async execute(interaction, client, lf) {
        try {
            var notas = require(`../utils/changelog/changelog_${interaction.locale}.json`)
        } catch (e) {
            if (!notas) notas = require(`../utils/changelog/changelog_en-US.json`)
        }

		const numero = interaction.options.getString('id')

		var id

		if (!numero) {
			id = aid
		} else {
			var id = parseInt(numero, 10)

			if (
				id <= 0 ||
				id > parseInt(aid, 10) ||
				!id ||
				id === 'undefined' ||
				id === 'null'
			)
				return interaction.reply(lf["changelog_1"])
		}

		const nota = notas.ids.find((it) => it.id == id)

		try {
			let embed = new EmbedBuilder()
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

			interaction.reply({ embeds: [embed] })
		} catch (e) {
			console.log(e)
		}
	},
}