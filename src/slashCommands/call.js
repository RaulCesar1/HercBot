require('dotenv').config()
const { SlashCommandBuilder, ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('call')
		.setDescription('Cria "calls" privadas.')
		.addSubcommand(sub =>
			sub.setName('criar')
			.setDescription('Cria sua "call privada".')	
			.addIntegerOption(option =>
				option.setName('usuarios-limite')
				.setDescription('Limite de usuários que poderão entrar na call.')
				.setRequired(true)
				.setMaxValue(99)
				.setMinValue(2)	
			)
		)
		.addSubcommand(sub =>
			sub.setName('deletar')
			.setDescription('Deleta a sua call.')	
		)
		.addSubcommand(sub =>
			sub.setName('categoria')
			.setDescription('Define a categoria onde será criada as calls.')
			.addStringOption(option =>
				option.setName('categoria-id')
				.setDescription('ID da categoria onde será criada as calls.')	
			)
		)
		.addSubcommand(sub =>
			sub.setName('modificar')
			.setDescription('Modifica características da sua call privada.')	
			.addIntegerOption(option =>
				option.setName('usuarios-limite')
				.setDescription('Limite de usuários que poderão entrar na call.')
				.setRequired(true)
				.setMaxValue(99)
				.setMinValue(2)	
			)
		),
	async execute(interaction, client, guild, herc) {
		await interaction.deferReply({ ephemeral: true })
		const callsCategoria = guild?.callsCategoria

		if(interaction.options._subcommand === "criar") {
			if(!callsCategoria) return interaction.editReply(`Este servidor não possui uma categoria definida para a criação de calls privadas!`)

			if(guild.calls.find(call => call.authorID == interaction.user.id)) 
			return interaction.editReply(`Você já criou uma call privada neste servidor, delete ela com </call deletar:1057616383459983430> antes de criar outra!`)

			const usuariosLimite = interaction.options.get('usuarios-limite').value

			try {
				const nomeCall = `Call de ${interaction.user.username}`
	
				interaction.guild.channels.create({
					name: nomeCall,
					parent: callsCategoria,
					type: ChannelType.GuildVoice,
					reason: `Call criada por ${interaction.user.tag} (${interaction.user.id})`
				}).then(async canal => {
					await canal.setUserLimit(usuariosLimite)
					await guild.calls.push(
						{
							authorID: interaction.user.id,
							channelID: canal.id
						}
					)
					await guild.save()
					await interaction.editReply({ content: `Sua call foi criada com sucesso!\n**Nome: \`${nomeCall}\`**\n**Limite de usuários: \`${usuariosLimite}\`**` })
				})
			} catch(e) {
				console.log(e)
			}
		}

		if(interaction.options._subcommand === "deletar") {
			if(!guild.calls.find(call => call.authorID == interaction.user.id))
			return interaction.editReply(`Você não possui nenhuma call neste servidor! Crie uma utilizando </call criar:1057616383459983430>.`)

			try {
				const call_old = guild.calls.find(call => call.authorID == interaction.user.id)
				const index_call = guild.calls.findIndex(call => call.authorID == interaction.user.id)
				const call_del = interaction.guild.channels.cache.get(call_old.channelID)

				if(!call_del) {
					await guild.calls.splice(index_call, 1)
					await guild.save()
					await interaction.editReply(`Parece que a sua call foi deletada manualmente, agora você já pode criar outra.`)
					return
				}

				await call_del.delete()
				await guild.calls.splice(index_call, 1)
				await guild.save()
				await interaction.editReply(`Sua call privada foi deletada com sucesso!`)
			} catch(e) {
				console.log(e)
			}
		}

		if(interaction.options._subcommand === "categoria") {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) 
			return interaction.editReply('Sem permissão.')
            let categoriaID = interaction.options.get('categoria-id')?.value

            if(!categoriaID) {
                return interaction.editReply({embeds: [
                    new EmbedBuilder()
                    .setDescription(
                        callsCategoria?`**<#${callsCategoria}>**`:
                        `
                        **O seu servidor ainda não possui uma categoria definida para a criação de calls privadas.**\n
                        Para definir a categoria de calls privadas, utilize o comando </call categoria:1057616383459983430> e insira o ID da categoria.
                        `)
                    .setColor('Blurple')
                ] })
            }

            try {
                let toVerify = interaction.guild.channels.cache.get(categoriaID) || false

                if(toVerify&&categoriaID==guild?.callsCategoria) return interaction.editReply(`Esta categoria já está definida como a categoria de calls privadas.`)
                if(toVerify == false) return interaction.editReply(`O ID inserido é inválido!`)
                if(toVerify.type !== 4) return interaction.editReply(`O ID inserido precisa ser de uma categoria de canais.`)

                guild.callsCategoria = categoriaID
                await guild.save()
                await interaction.editReply(`A categoria de calls privadas foi definida com sucesso para **<#${categoriaID}>**!`)
            } catch(e) {
                console.log(e)
            }
		}

		if(interaction.options._subcommand === "modificar") {
			if(!guild.calls.find(call => call.authorID == interaction.user.id))
			return interaction.editReply(`Você não possui nenhuma call neste servidor! Crie uma utilizando </call criar:1057616383459983430>.`)

			const usuariosLimite = interaction.options.get('usuarios-limite').value

			const call = guild.calls.find(call => call.authorID == interaction.user.id)
			const canal = interaction.guild.channels.cache.get(call.channelID)

			if(canal.members.size > usuariosLimite) return interaction.editReply('O limite de usuários inserido é menor que a quantidade de usuários conectados na call.')

			try {
				await canal.setUserLimit(usuariosLimite)
				await interaction.editReply(`O limite de usuários da sua call foi alterado para **${usuariosLimite} usuários**.`)
			} catch(e) {
				console.log(e)
			}
		}
    }
}