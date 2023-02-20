require('dotenv').config()
const { SlashCommandBuilder, codeBlock, AttachmentBuilder } = require('discord.js')
const axios = require('axios')
const fs = require('fs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('converter-base')
		.setDescription('Converta números da base decimal para outras bases.')
        .addIntegerOption(option =>
            option.setName('decimal')
            .setDescription('Número em base decimal que será convertido.')
            .setMinValue(1)
            .setRequired(true)    
        )
        .addIntegerOption(option =>
            option.setName('para-base')
            .setDescription('Para qual base o número será convertido. Ex: 2 (base binária)')
            .setMinValue(2)
            .setMaxValue(9)
            .setRequired(true)    
        ),
	async execute(interaction, client, guild, herc, user) {
        const numeroDecimal = interaction.options.get('decimal').value
        const paraBase = interaction.options.get('para-base').value

        if (numeroDecimal < paraBase) return interaction.reply({ ephemeral: true, content: 'O número decimal deve ser maior ou igual a base para qual será convertido.' })

        function converter(numeroDecimal, paraBase) {
            let numeroConvertido = ""
            let conversoes = ""
            
            let paraDividir = numeroDecimal

            let i = 1
        
            do {    
                numeroConvertido += (paraDividir % paraBase).toString()
                conversoes += `${i} - ${paraDividir} ÷ ${paraBase} | Resto: ${paraDividir % paraBase}\n`
                paraDividir = Math.floor(paraDividir / paraBase)
                i++
            } while(paraDividir >= paraBase)
        
            numeroConvertido += paraDividir.toString()

            let nco = numeroConvertido

            conversoes += `${i} - + ${paraDividir}\n`
        
            const array1 = numeroConvertido.split('')
            const arrayReversa = array1.reverse()
            
            numeroConvertido = arrayReversa.join('')

            conversoes += `${i+1} - ${nco} -> (inverte) -> ${numeroConvertido}`
        
            return [numeroConvertido, conversoes]
        }

        const convertido = converter(numeroDecimal, paraBase)

        const arquivo = new AttachmentBuilder(Buffer.from(convertido[1], 'latin1'), { name: 'calculo.txt' })

        await interaction.reply({ ephemeral: true, files: [arquivo], content: `${codeBlock(`${numeroDecimal} -> base ${paraBase} = ${convertido[0]}`)}` })
    }
}