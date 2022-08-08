const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	EmbedBuilder,
} = require('discord.js')

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Profile Picture')
		.setType(ApplicationCommandType.User),
	async execute(interaction, client, lf) {
		var avatarTarget = interaction.targetUser.avatarURL()

		let embedAvatarTarget = new EmbedBuilder()
			.setAuthor({
				name: !avatarTarget
					? lf["avatar_1"].replace('{tag}', interaction.targetUser.tag)
					: interaction.targetUser.tag,
			})
			.setImage(avatarTarget)
			.setColor('Yellow')

		interaction.reply({ embeds: [embedAvatarTarget], ephemeral: true })
	},
}
