require('dotenv').config()
const { 
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} = require('discord.js');

const Herc = require('../models/Herc.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('maintenance')
		.setDescription('Developer command.')
        .setDescriptionLocalizations({
            "pt-BR": "Comando de desenvolvedor."
        }),
	async execute(interaction, client, lf) {
        if(interaction.user.id !== "693929568020725843") return interaction.reply({ content: "No permission.", ephemeral: true })

        const herc = await Herc.findOne({ id: process.env.CLIENT_ID })
        if(!herc) return new Herc().save()

        const row = new ActionRowBuilder()
        .addComponents([
            new ButtonBuilder()
            .setCustomId('toggleManutencao')
            .setLabel(herc.manutencao==true?'Desativar':'Ativar')
            .setStyle(herc.manutencao==true?ButtonStyle.Danger:ButtonStyle.Success),
        ])

        try {
            let painelManutencao = new EmbedBuilder()
            .setColor('Aqua')
            .setDescription(`A manutenção está ${herc.manutencao==true?'`ligada`':'`desligada`'}`)

            interaction.reply({ embeds: [painelManutencao], components: [row], ephemeral: true })
        } catch(e) {
            console.log(e)
        }
	},
};