require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear')
        .addNumberOption(option => option.setName('messages').setDescription('Messages').setRequired(true).setMaxValue(100).setMinValue(2)),
	async execute(interaction, client, lf) {
        const messagesQ = interaction.options.get('messages').value
        
        try {
            await interaction.channel.bulkDelete(messagesQ)
            .then(async () => {
                await interaction.reply(lf["clear_1"]
                .replace('{interaction.user.username}', interaction.user.username)
                .replace('{messagesQ}', messagesQ))
                setTimeout(() => interaction.deleteReply(), 4000)
            })
        } catch(e) {
            console.log(e)
        }
	},
};