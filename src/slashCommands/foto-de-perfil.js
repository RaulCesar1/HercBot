require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('foto-de-perfil')
		.setDescription('Veja a foto de perfil de outro usuário.')
        .addUserOption(option => 
            option.setName('usuario')
            .setDescription('Usuário que deseja ver a foto de perfil, deixe em branco para ver sua própria foto.')
        ),
	async execute(interaction, client) {
        var user = interaction.options.get('usuario')?.user || interaction.user

        try {
            const embedPP = new EmbedBuilder()
            .setAuthor({ name: user.tag })
            .setImage(user.avatarURL())
            .setColor('Blurple')
            !user.avatarURL()?embedPP.setDescription('Este usuário não possui uma foto de perfil!'):''

            interaction.reply({ embeds:[embedPP] })
        } catch(e) {
            console.log(e)
        }
    }
}