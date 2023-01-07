require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const package = require('../../package.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sobre')
		.setDescription('Mostra informações sobre o bot.'),
	async execute(interaction, client) {
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
            **Herc** é um bot criado para auxiliar o usuário a manter o controle de seus servidores.
            Criado por **Raul César**, o bot foi desenvolvido em linguagem **JavaScript** e utiliza o framework **Discord.js**.
            `)
            .setFooter({ text: `Versão ${package.version}` })
            .setThumbnail(client.user.avatarURL())
            .setColor('Blurple')

            interaction.reply({ ephemeral: true, embeds: [embedAbout], components: [buttons] })
        } catch(e) {
            console.log(e)
        }
	},
};