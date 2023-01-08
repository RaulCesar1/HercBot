require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { conjugar } = require('../utils/conjugar.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('conjugacao')
		.setDescription('Envie um verbo para ver suas conjugações verbais.')
        .addStringOption(option =>
            option.setName('verbo')
            .setDescription('Verbo que deseja ver as conjugações.')    
            .setRequired(true)
        ),
	async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true })
        const verbo = interaction.options.get('verbo').value

        try {
            const conjugacoes = await conjugar(verbo)
            interaction.editReply({ embeds: [
                new EmbedBuilder()
                .setAuthor({ name: `Conjugações do verbo "${verbo}"`, iconURL: interaction.user.avatarURL() })
                .setColor('Blurple')
                .setDescription(conjugacoes.join('\n'))
            ] })
        } catch(e) {
            return interaction.editReply({ ephemeral: true, content: `Não foi possível encontrar as conjugações verbais para \`${verbo}\`, verfique se digitou corretamente.` })
        } 
    }
}