require('dotenv').config()
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anotações')
		.setDescription('Comando relacionado a anotações.')
        .addSubcommand(sub =>
            sub.setName('criar')
            .setDescription('Crie suas anotações.')
        )
        .addSubcommand(sub =>
            sub.setName('listar')
            .setDescription('Mostra uma lista com suas anotações.')    
        )
        .addSubcommand(sub =>
            sub.setName('selecionar')
            .setDescription('Selecione uma anotação sua pelo ID e veja mais detalhes sobre ela.')
            .addIntegerOption(option =>
                option.setName('anotacao-id')
                .setDescription('ID da sua anotação.')
                .setRequired(true)
            )    
        )
        .addSubcommand(sub =>
            sub.setName('deletar')
            .setDescription('Exclua uma anotação sua.')
            .addIntegerOption(option =>
                option.setName('anotacao-id')
                .setDescription('ID da sua anotação.')
                .setRequired(true)
            )   
        )
        .addSubcommand(sub =>
            sub.setName('modificar')
            .setDescription('Modifique uma anotação sua.')
            .addIntegerOption(option =>
                option.setName('anotacao-id')
                .setDescription('ID da sua anotação.')
                .setRequired(true)
            )   
        ),
	async execute(interaction, client, guild, herc, user) {
        if(interaction.options._subcommand === "modificar") {
            const anotacaoId = interaction.options.getInteger('anotacao-id')
            const anotacao = user.anotacoes.find(x => x.id == anotacaoId)
        
            if(!anotacao) return interaction.reply({ ephemeral: true, content: 'Não foi possível encontrar uma anotação sua com esse ID. Verifique se o ID que inseriu existe.' })

            const Formulario = new ModalBuilder()
            .setTitle('Anotação')
            .setCustomId('anotacao-modificar')

            var Anotacao = new TextInputBuilder()
                .setCustomId(`${anotacao.id}`)
                .setLabel(`Escreva a nova anotação aqui`)
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(1)
                .setPlaceholder(anotacao.texto)

            Anotacao = new ActionRowBuilder().addComponents(Anotacao) 

            Formulario.addComponents(Anotacao)

            return await interaction.showModal(Formulario)
        }

        if(interaction.options._subcommand === "deletar") {
            const anotacaoId = interaction.options.getInteger('anotacao-id')
            const anotacao = user.anotacoes.find(x => x.id == anotacaoId)
            const anotacaoIndex = user.anotacoes.findIndex(x => x.id == anotacaoId)

            if(!anotacao) return interaction.reply({ ephemeral: true, content: 'Não foi possível encontrar uma anotação sua com esse ID. Verifique se o ID que inseriu existe.' })

            try {
                await user.anotacoes.splice(anotacaoIndex, 1)
                await user.save()

                return interaction.reply({ ephemeral: true, content: `Anotação \`${anotacaoId}\` foi excluída.` })
            } catch(e) {
                console.log(e)
            }
        }

        if(interaction.options._subcommand === "selecionar") {
            const anotacaoId = interaction.options.getInteger('anotacao-id')
            const anotacao = user.anotacoes.find(x => x.id == anotacaoId)

            if(!anotacao) return interaction.reply({ ephemeral: true, content: 'Não foi possível encontrar uma anotação sua com esse ID. Verifique se o ID que inseriu existe.' })

            return interaction.reply({ ephemeral: true, embeds: [
                new EmbedBuilder()
                .setColor('Blurple')
                .setAuthor({ name: anotacao.titulo, iconURL: interaction.user.avatarURL() })
                .setDescription(`\`\`\`${anotacao.texto}\`\`\``)
                .setFooter({ text: `ID ${anotacao.id} | Alterada em: ${new Date(anotacao.alteradaEm).toLocaleString('pt-BR')}` })
            ] })
        }

        if(interaction.options._subcommand === "criar") {
            const Formulario = new ModalBuilder()
            .setTitle('Anotação')
            .setCustomId('anotacao-create')

            var Titulo = new TextInputBuilder()
                .setCustomId('__b')
                .setLabel('Dê um titulo para a sua anotação')
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setMinLength(1)
                .setMaxLength(30)

            var Anotacao = new TextInputBuilder()
                .setCustomId('__a')
                .setLabel(`Escreva sua anotação aqui`)
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(1)

            Anotacao = new ActionRowBuilder().addComponents(Anotacao) 
            Titulo = new ActionRowBuilder().addComponents(Titulo)

            Formulario.addComponents(Titulo, Anotacao)

            return await interaction.showModal(Formulario)
        }

        if(interaction.options._subcommand === "listar") {
            const anotacoesUsuarioIds = user.anotacoes.map(x => x.id)

            return interaction.reply({ ephemeral: true, embeds: [
                new EmbedBuilder()
                .setColor('Blurple')
                .setAuthor({ name: "Suas anotações", iconURL: interaction.user.avatarURL() })
                .setDescription(!anotacoesUsuarioIds||anotacoesUsuarioIds.length==0?'Você não possui nenhuma anotação ainda.':anotacoesUsuarioIds.join('\n'))
                .setFooter({ text: 'Para ler alguma anotação utilize o comando /anotações selecionar <id>' })
            ] })
        }
    }
}