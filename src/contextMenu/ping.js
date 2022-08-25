const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
    EmbedBuilder,
} = require('discord.js')

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Ping')
		.setType(ApplicationCommandType.Message),
	async execute(interaction, client, lf) {
        interaction.reply({ embeds: [
			new EmbedBuilder()
				.setDescription(lf['ping_1'].replace('{bot_ping}', client.ws.ping))
				.setColor('Aqua')
		], ephemeral: true })
	},
}