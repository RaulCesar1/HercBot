require('dotenv').config()
const { 
    SlashCommandBuilder,
    TextInputBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputStyle,
    PermissionsBitField,
    EmbedBuilder,
} = require('discord.js')

const Guild = require('../models/Guild.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tíquete')
		.setDescription('Comandos relacionados aos tíquetes de suporte.')
        .addSubcommand(sub => 
            sub.setName('abrir')
            .setDescription('Abre um tíquete de suporte.')
        )
        .addSubcommand(sub => 
            sub.setName('fechar')
            .setDescription('Fecha o tíquete de suporte em aberto.')
        ),
	async execute(interaction, client) {
        const guild = await Guild.findOne({ _id: interaction.guildId })
        const tokenCategory = guild.tokenCategory

        if (interaction.options._subcommand === 'fechar') {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ content: `Sem permissão.`, ephemeral: true })
            
            let canalTicket = client.channels.cache.get(interaction.channelId)

            if(canalTicket.parentId !== tokenCategory)
                return interaction.reply({ content: `Utilize este comando em um canal de tíquete.`, ephemeral: true })

            try {
                await interaction.reply({ content: `O tíquete será fechado em 10 segundos.` })
                setTimeout(async () => {
                    try{await canalTicket.delete()}catch(e){}
                }, 10 * 1000)
            } catch(e) {
                console.log(e)
            }
            return
        }

        if (interaction.options._subcommand === 'abrir') {
            if(!tokenCategory) return interaction.reply({ content: `Este servidor não possui uma categoria definida para a criação de tíquetes!`, ephemeral: true })

            let Formulario = new ModalBuilder()
            .setTitle('Tíquete')
            .setCustomId('ticket-create')

            var AssuntoPrincipal = new TextInputBuilder()
                .setCustomId('__a')
                .setLabel(`Assunto do Tíquete`)
                .setMaxLength(50)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setMinLength(1)

            var Descricao = new TextInputBuilder()
                .setCustomId('__b')
                .setLabel(`Descrição`)
                .setRequired(true)
                .setMaxLength(500)
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(1)

            AssuntoPrincipal = new ActionRowBuilder().addComponents(AssuntoPrincipal) 
            Descricao = new ActionRowBuilder().addComponents(Descricao) 

            Formulario.addComponents(AssuntoPrincipal, Descricao)

            return await interaction.showModal(Formulario)
        }
	},
};