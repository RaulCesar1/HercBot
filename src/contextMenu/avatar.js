const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	EmbedBuilder,
} = require('discord.js')

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Foto de Perfil')
		.setType(ApplicationCommandType.User),
	async execute(interaction, client) {
		var avatarTarget = interaction.targetUser.avatarURL()

		let embedAvatarTarget = new EmbedBuilder()
			.setAuthor({ name: !avatarTarget? `O usuário ${interaction.targetUser.tag} não possui uma foto de perfil!`: interaction.targetUser.tag })
			.setImage(avatarTarget)
			.setColor('Yellow')

		interaction.reply({ embeds: [embedAvatarTarget], ephemeral: true })
	},
}
