const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionsBitField } = require("discord.js")

exports.categoriaCallsBtn = async function(interaction, user, guild, herc) {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ content: `Sem permissão.`, ephemeral: true })
    
    const Formulario = new ModalBuilder()
        .setTitle('Categoria de Calls')
        .setCustomId('categoria-calls.modal')

    var NovaCategoria = new TextInputBuilder()
        .setCustomId(`__a`)
        .setLabel(`Insira o ID da categoria`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)

    NovaCategoria = new ActionRowBuilder().addComponents(NovaCategoria) 

    Formulario.addComponents(NovaCategoria)

    return await interaction.showModal(Formulario)
}

exports.categoriaCallsModal = async function(interaction, user, guild, herc) {
    try {
        const categoriaID = interaction.components[0].components[0].value
        const toVerify = interaction.guild.channels.cache.get(categoriaID) || false

        if(toVerify && categoriaID == guild.callsCategoria) return interaction.reply({ ephemeral: true, content: 'Esta categoria já está definida como a categoria de calls privadas.' })
        if(toVerify == false) return interaction.reply({ ephemeral: true, content: 'O ID inserido é inválido!' })
        if(toVerify.type !== 4) return interaction.reply({ ephemeral: true, content: 'O ID inserido precisa ser de uma categoria de canais.' })

        guild.callsCategoria = categoriaID
        await guild.save()
        await interaction.reply({ ephemeral: true, content: `A categoria de calls privadas foi definida com sucesso para **<#${categoriaID}>**!` })
    } catch(e) {
        console.log(e)
    }
}

exports.categoriaTiquetesBtn = async function(interaction, user, guild, herc) {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({ content: `Sem permissão.`, ephemeral: true })
    
    const Formulario = new ModalBuilder()
        .setTitle('Categoria de Tíquetes')
        .setCustomId('categoria-tiquetes.modal')

    var NovaCategoria = new TextInputBuilder()
        .setCustomId(`__a`)
        .setLabel(`Insira o ID da categoria`)
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)

    NovaCategoria = new ActionRowBuilder().addComponents(NovaCategoria) 

    Formulario.addComponents(NovaCategoria)

    return await interaction.showModal(Formulario)
}

exports.categoriaTiquetesModal = async function(interaction, user, guild, herc) {
    try {
        const categoriaID = interaction.components[0].components[0].value
        const toVerify = interaction.guild.channels.cache.get(categoriaID) || false

        if(toVerify && categoriaID == guild.tokenCategory) return interaction.reply({ content: `Esta categoria já está definida como a categoria de tíquetes.`, ephemeral: true })
        if(toVerify == false) return interaction.reply({ content: `O ID inserido é inválido!`, ephemeral: true })
        if(toVerify.type !== 4) return interaction.reply({ content: `O ID inserido precisa ser de uma categoria de canais.`, ephemeral: true })

        guild.tokenCategory = categoriaID
        await guild.save()
        await interaction.reply({ content: `A categoria de tíquetes foi definida com sucesso para **<#${categoriaID}>**!`, ephemeral: true })
    } catch(e) {
        console.log(e)
    }
}