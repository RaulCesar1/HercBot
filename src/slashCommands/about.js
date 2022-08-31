require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const package = require('../../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Show information about the bot.')
        .setNameLocalizations({
            "pt-BR": "sobre"
        })
        .setDescriptionLocalizations({
            "pt-BR": "Mostra informações sobre o bot."
        }),
	async execute(interaction, client, lf) {
        try {
            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)         
                        .setURL('https://github.com/RaulCesar1/HercBot')
                        .setLabel('GitHub'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)         
                        .setURL('https://twitter.com/RaulCsrOliveira')
                        .setLabel('Twitter'),
                )

            const embedAbout = new EmbedBuilder()
            .setDescription(`
                ${lf["about_1"]}
                ${lf["about_2"]}
            `)
            .setFooter({ text: `${lf["about_3"]} ${package.version}` })
            .setThumbnail(client.user.avatarURL())
            .setColor('Aqua')

            interaction.reply({ embeds: [embedAbout], components: [buttons] })
        } catch(e) {
            console.log(e)
        }
	},
};