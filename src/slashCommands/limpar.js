require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('limpar')
		.setDescription('Limpa uma determinada quantidade de mensagens em um canal.')
        .addIntegerOption(option => 
            option
            .setName('mensagens')
            .setDescription('Quantidade de mensagens que deseja apagar.')
            .setRequired(true)
            .setMaxValue(100)
            .setMinValue(2)
        ),
	async execute(interaction, client) {
        const messagesQ = interaction.options.get('mensagens').value
        
        try {
            await interaction.channel.bulkDelete(messagesQ, true)
            .then(async (messagesMap) => {
                let mapSize = messagesMap.size
                if(mapSize<=0) return interaction.reply({ content: `Não foi possível limpar nenhuma mensagem nesse canal!`, ephemeral: true })

                await interaction.reply(`**${interaction.user.username} limpou ${messagesQ} mensagens nesse canal!**`)
                setTimeout(() => interaction.deleteReply(), 4000)
            })
        } catch(e) {
            console.log(e)
        }
	},
};