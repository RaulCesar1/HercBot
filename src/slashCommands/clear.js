require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears a specified amount of messages in a channel.')
        .setNameLocalizations({
            "pt-BR": "limpar"
        })
        .setDescriptionLocalizations({
            "pt-BR": "Limpa uma determinada quantidade de mensagens em um canal."
        })
        .addIntegerOption(option => 
            option
            .setName('messages')
            .setDescription('Number of messages you want to delete.')
            .setNameLocalizations({
                "pt-BR": "mensagens"
            })
            .setDescriptionLocalizations({
                "pt-BR": "Quantidade de mensagens que deseja apagar."
            })
            .setRequired(true)
            .setMaxValue(100)
            .setMinValue(2)
        ),
	async execute(interaction, client, lf) {
        const messagesQ = interaction.options.get('messages').value
        
        try {
            await interaction.channel.bulkDelete(messagesQ, true)
            .then(async (messagesMap) => {
                let mapSize = messagesMap.size
                if(mapSize<=0) return interaction.reply({ content: lf["clear_2"], ephemeral: true })

                await interaction.reply(lf["clear_1"]
                .replace('{interaction.user.username}', interaction.user.username)
                .replace('{messagesQ}', mapSize))
                setTimeout(() => interaction.deleteReply(), 4000)
            })
        } catch(e) {
            console.log(e)
        }
	},
};