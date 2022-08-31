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
		.setDescription('Ticket')
        .addSubcommand(sub => 
            sub.setName('open')
            .setDescription('Open a support ticket.')
            .setNameLocalizations({
                "pt-BR": "abrir"
            })
            .setDescriptionLocalizations({
                "pt-BR": "Abre um ticket de suporte."
            })
        )
        .addSubcommand(sub => 
            sub.setName('close')
            .setDescription('Close the current open ticket.')
            .setNameLocalizations({
                "pt-BR": "fechar"
            })
            .setDescriptionLocalizations({
                "pt-BR": "Fecha o ticket de suporte em aberto."
            })
        )
        .addSubcommand(sub => 
            sub.setName('category')
            .setDescription('Defines the category where tickets will be created.')
            .setNameLocalizations({
                "pt-BR": "categoria"
            })
            .setDescriptionLocalizations({
                "pt-BR": "Define a categoria onde os tickets serão criados."
            })
            .addStringOption(option =>
                option.setName('id')
                .setDescription('The ID of the category where the tickets will be created.')
                .setDescriptionLocalizations({
                    "pt-BR": "O ID da categoria onde os tickets serão criados."
                })
            )
        ),
	async execute(interaction, client, lf) {
        const guild = await Guild.findOne({ _id: interaction.guildId })
        const tokenCategory = guild?.tokenCategory

        if(interaction.options._subcommand === 'category') {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ content: lf["ticket_1"], ephemeral: true })
            let optionID = interaction.options.get('id')?.value

            if(!optionID) {
                return interaction.reply({embeds: [
                    new EmbedBuilder()
                    .setDescription(tokenCategory?`**<#${tokenCategory}>**`:`${lf["ticket_6"]}\n\n${lf["ticket_7"]}`)
                    .setColor('Aqua')
                ], ephemeral: true})
            }

            try {
                let toVerify = interaction.guild.channels.cache.get(optionID) || false

                if(toVerify&&optionID==guild?.tokenCategory) return interaction.reply({ content: lf["ticket_11"], ephemeral: true })
                if(toVerify == false) return interaction.reply({ content: lf["ticket_8"], ephemeral: true })
                if(toVerify.type !== 4) return interaction.reply({ content: lf["ticket_9"], ephemeral: true })

                guild.tokenCategory = optionID
                await guild.save()
                await interaction.reply({ content: lf["ticket_10"].replace('{id}', optionID), ephemeral: true })
            } catch(e) {
                console.log(e)
            }
        }

        if (interaction.options._subcommand === 'close') {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({ content: lf["ticket_1"], ephemeral: true })
            
            let canalTicket = client.channels.cache.get(interaction.channelId)

            if(canalTicket.parentId !== tokenCategory)
                return interaction.reply({ content: lf["ticket_2"], ephemeral: true })

            try {
                await interaction.reply({ content: lf["ticket_3"] })
                setTimeout(async () => {
                    await canalTicket.delete()
                }, 10 * 1000)
            } catch(e) {
                console.log(e)
            }
            return
        }

        if (interaction.options._subcommand === 'open') {
            if(!tokenCategory) return interaction.reply({ content: lf["ticket_16"], ephemeral: true })

            let Formulario = new ModalBuilder()
            .setTitle('Ticket')
            .setCustomId('ticket-create')

            var AssuntoPrincipal = new TextInputBuilder()
                .setCustomId('__a')
                .setLabel(lf["ticket_4"])
                .setMaxLength(50)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)

            var Descricao = new TextInputBuilder()
                .setCustomId('__b')
                .setLabel(lf["ticket_5"])
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