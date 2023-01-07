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
		.setName('ticket')
		.setDescription('Comandos relacionados aos tickets de suporte.')
        .addSubcommand(sub => 
            sub.setName('abrir')
            .setDescription('Abre um ticket de suporte.')
        )
        .addSubcommand(sub => 
            sub.setName('fechar')
            .setDescription('Fecha o ticket de suporte em aberto.')
        )
        .addSubcommand(sub => 
            sub.setName('categoria')
            .setDescription('Define a categoria onde os tickets serão criados.')
            .addStringOption(option =>
                option.setName('id')
                .setDescription('O ID da categoria onde os tickets serão criados.')
            )
        ),
	async execute(interaction, client) {
        const guild = await Guild.findOne({ _id: interaction.guildId })
        const tokenCategory = guild?.tokenCategory

        if(interaction.options._subcommand === 'categoria') {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ content: `Sem permissão.`, ephemeral: true })
            let optionID = interaction.options.get('id')?.value

            if(!optionID) {
                return interaction.reply({embeds: [
                    new EmbedBuilder()
                    .setDescription(
                        tokenCategory?`**<#${tokenCategory}>**`:
                        `
                        **O seu servidor ainda não possui uma categoria definida para a criação de tickets.**\n
                        Para definir a categoria de tickets, utilize o comando **/ticket categoria** e insira o ID da categoria.
                        `)
                    .setColor('Blurple')
                ], ephemeral: true})
            }

            try {
                let toVerify = interaction.guild.channels.cache.get(optionID) || false

                if(toVerify&&optionID==guild?.tokenCategory) return interaction.reply({ content: `Esta categoria já está definida como a categoria de tickets.`, ephemeral: true })
                if(toVerify == false) return interaction.reply({ content: `O ID inserido é inválido!`, ephemeral: true })
                if(toVerify.type !== 4) return interaction.reply({ content: `O ID inserido precisa ser de uma categoria de canais.`, ephemeral: true })

                guild.tokenCategory = optionID
                await guild.save()
                await interaction.reply({ content: `"A categoria de tickets foi definida com sucesso para **<#${optionID}>**!`, ephemeral: true })
            } catch(e) {
                console.log(e)
            }
        }

        if (interaction.options._subcommand === 'fechar') {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ content: `Sem permissão.`, ephemeral: true })
            
            let canalTicket = client.channels.cache.get(interaction.channelId)

            if(canalTicket.parentId !== tokenCategory)
                return interaction.reply({ content: `Utilize este comando em um canal de ticket.`, ephemeral: true })

            try {
                await interaction.reply({ content: `O Ticket será excluido em 10 segundos.` })
                setTimeout(async () => {
                    try{await canalTicket.delete()}catch(e){}
                }, 10 * 1000)
            } catch(e) {
                console.log(e)
            }
            return
        }

        if (interaction.options._subcommand === 'abrir') {
            if(!tokenCategory) return interaction.reply({ content: `Este servidor não possui uma categoria definida para a criação de tickets!`, ephemeral: true })

            let Formulario = new ModalBuilder()
            .setTitle('Ticket')
            .setCustomId('ticket-create')

            var AssuntoPrincipal = new TextInputBuilder()
                .setCustomId('__a')
                .setLabel(`Assunto do Ticket`)
                .setMaxLength(50)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)

            var Descricao = new TextInputBuilder()
                .setCustomId('__b')
                .setLabel(`Descrição`)
                .setRequired(true)
                .setMaxLength(500)
                .setStyle(TextInputStyle.Paragraph)

            AssuntoPrincipal = new ActionRowBuilder().addComponents(AssuntoPrincipal) 
            Descricao = new ActionRowBuilder().addComponents(Descricao) 

            Formulario.addComponents(AssuntoPrincipal, Descricao)

            return await interaction.showModal(Formulario)
        }
	},
};