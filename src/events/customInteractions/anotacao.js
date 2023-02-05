exports.create = async function(interaction, user, guild, herc) {
    function gerarId(o) {
        var anotacaoId = o + 1
        if(user.anotacoes.find(x => x.id == anotacaoId)) return gerarId(o + 1) 
        return anotacaoId
    }

    try {
        const Anotacao = interaction.components[1].components[0].value
        const Titulo = interaction.components[0].components[0].value

        const anotacaoId = gerarId(user.anotacoes.length)
        
        await user.anotacoes.push(
            {
                titulo: Titulo,
                texto: Anotacao,
                alteradaEm: Date.now(),
                id: anotacaoId
            }
        )
        await user.save()
        await interaction.reply({ ephemeral: true, content: `Anotação criada com sucesso! Utilize </anotações listar:1062838390120259685> para ver suas anotações.\nID: **${anotacaoId}**` })
    } catch(e) {
        console.log(e)
        interaction.reply({ ephemeral: true, content: 'Não foi possível criar essa anotação.' })
    }
}

exports.modify = async function(interaction, user, guild, herc) {
    try {
        const Anotacao = interaction.components[0].components[0].value
        const anotacaoId = interaction.components[0].components[0].customId

        const anotacaoIndex = user.anotacoes.findIndex(x => x.id == anotacaoId)
        const anotacao = user.anotacoes.find(x => x.id == anotacaoId)

        const titulo = anotacao.titulo

        await user.anotacoes.splice(anotacaoIndex, 1)
        await user.anotacoes.push(
            {
                titulo,
                texto: Anotacao,
                alteradaEm: Date.now(),
                id: anotacaoId
            }
        )
        await user.save()
        await interaction.reply({ ephemeral: true, content: `Anotação modificada com sucesso!` })
    } catch(e) {
        console.log(e)
        interaction.reply({ ephemeral: true, content: 'Não foi possível modificar essa anotação.' })
    }
}