const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
    EmbedBuilder,
} = require('discord.js')

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Ping')
		.setType(ApplicationCommandType.Message),
	async execute(interaction, client) {
        interaction.reply({ embeds: [
			new EmbedBuilder()
				.setDescription(`**Ping do bot: \`${client.ws.ping}ms\`**`)
				.setColor('Blurple')
		], ephemeral: true })
	},
}