require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('configurar')
		.setDescription('Mostra o painel de configuração do bot.'),
	async execute(interaction, client, guild, herc, user) {
        try {
            await interaction.deferReply({ ephemeral: true })

            const categoriaCalls = interaction.guild.channels.cache.get(guild.callsCategoria) || 'Não definido.'
            const categoriaTiquetes = interaction.guild.channels.cache.get(guild.tokenCategory) || 'Não definido.'

            const fields = [
                {
                    name: 'Categoria para a criação de calls privadas:',
                    value: `${categoriaCalls}`,
                    inline: true
                },
                {
                    name: 'Categoria para a criação de tíquetes de suporte:',
                    value: `${categoriaTiquetes}`,
                    inline: true
                },
            ]

            const buttons = new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setLabel('Categoria de Calls')
                        .setCustomId('categoria-calls.btn'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setLabel('Categoria de Tíquetes')
                        .setCustomId('categoria-tiquetes.btn')
                ])

            await interaction.editReply({ embeds: [
                new EmbedBuilder()
                .setColor('Blurple')
                .setAuthor({ name: 'Painel de configuração', iconURL: client.user.avatarURL() })
                .addFields(fields)
            ], components: [buttons] })
        } catch(e) {
            console.log(e)
        }
    }
}