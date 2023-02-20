require('dotenv').config()
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('emojiar')
		.setDescription('Transforme sua mensagem em emojis.')
        .addStringOption(option =>
            option.setName('mensagem')
            .setDescription('Mensagem que será transformada em emojis.')
            .setRequired(true)    
            .setMaxLength(500)
        ),
	async execute(interaction, client, guild, herc, user) {
        var mensagem = interaction.options.get('mensagem').value

        await interaction.deferReply()

        function isLetter(c) {
            return c.toLowerCase() != c.toUpperCase();
        }

        var nums = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:"]

        var newString = ""

        for(let i = 0; i < mensagem.length; i++) {
            let char = mensagem.charAt(i)

            var toPush = ""

            switch(char) {
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    toPush = nums[parseInt(char, 10)]
                    break
                case ' ':
                    toPush = char
                    break
                case '!':
                    toPush = ':exclamation:'
                    break
                case '?':
                    toPush = ':question:'
                    break
                case '=':
                    toPush = ':heavy_equals_sign:'
                    break
                case '+':
                    toPush = ':heavy_plus_sign:'
                    break
                case '$':
                    toPush = ':heavy_dollar_sign:'
                    break
                default:
                    toPush = char
                    if(isLetter(char) == true) toPush = `:regional_indicator_${char.toLowerCase()}:`
                    break
            }

            newString+=toPush
        }

        interaction.editReply(newString)
    }
}