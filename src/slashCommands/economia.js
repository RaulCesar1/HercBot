require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { randomUUID } = require('crypto')
const cliProgress = require('cli-progress')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('economia')
		.setDescription('Comandos de economia do bot.')
		.addSubcommandGroup(sub =>
			sub.setName('carteira')
			.setDescription('Economia -> carteira')
			.addSubcommand(sub =>
				sub.setName('ver')
				.setDescription('Veja o dinheiro que está guardado em sua carteira.')	
			)	
		)
		.addSubcommandGroup(sub =>
			sub.setName('banco')	
			.setDescription('Economia -> banco')
			.addSubcommand(sub =>
				sub.setName('ver')
				.setDescription('Veja as informações sobre sua conta bancária.')	
			)
			.addSubcommand(sub => 
				sub.setName('depositar')
				.setDescription('Deposite o dinheiro que está em sua carteira em sua conta do banco.')	
				.addIntegerOption(option => 
					option.setName('valor')
					.setDescription('O valor que será depositado.')
					.setRequired(true)
					.setMinValue(1)	
				)
			)
			.addSubcommand(sub =>
				sub.setName('sacar')
				.setDescription('Saque o dinheiro que está em sua conta do banco.')
				.addIntegerOption(option =>
					option.setName('valor')
					.setDescription('O valor que será sacado.')	
					.setRequired(true)
					.setMinValue(1)
				)	
			)
		)
		.addSubcommandGroup(sub =>
			sub.setName('cheque')
			.setDescription('Economia -> cheque')
			.addSubcommand(sub => 
				sub.setName('criar')
				.setDescription('Cria um cheque com um valor definido.')
				.addIntegerOption(option =>
					option.setName('valor')	
					.setDescription('O valor do cheque que será criado.')
					.setRequired(true)
					.setMinValue(1)
				)	
			)
			.addSubcommand(sub =>
				sub.setName('listar')
				.setDescription('Mostra os cheques que você já criou.')	
			)	
			.addSubcommand(sub =>
				sub.setName('usar')
				.setDescription('Utilize um cheque e receba o dinheiro em sua conta do banco.')	
				.addStringOption(option =>
					option.setName('codigo')
					.setDescription('Código do cheque que será utilizado.')
					.setRequired(true)
					.setMinLength(43)	
					.setMaxLength(43)
				)
			)
		)
		.addSubcommandGroup(sub =>
			sub.setName('trabalho')
			.setDescription('Economia -> trabalho')	
			.addSubcommand(sub =>
				sub.setName('trabalhar')
				.setDescription('Trabalhe para ganhar dinheiro.')
				.addIntegerOption(option => 
					option.setName('tempo')
					.setDescription('Quantidade de horas que irá trabalhar. Deixe em branco para trabalhar por 30 minutos.')
					.setMaxValue(8)
					.setMinValue(1)	
				)	
			)
			.addSubcommand(sub =>
				sub.setName('progresso')
				.setDescription('Acompanhe seu progresso no trabalho.')
			)
			.addSubcommand(sub =>
				sub.setName('cancelar')
				.setDescription('Cancele o trabalho que está fazendo.')	
			)
		)
		.addSubcommandGroup(sub =>
			sub.setName('bolsa-de-valores')
			.setDescription('Economia -> bolsa de valores')
			.addSubcommand(sub =>
				sub.setName('ver')
				.setDescription('Veja a situação atual da bolsa de valores.')	
			)	
		),
	async execute(interaction, client, guild, herc, user){
		if(interaction.options._group === "bolsa-de-valores") {
			if(interaction.options._subcommand === "ver") {
				return interaction.reply({ ephemeral: true, embeds: [
					new EmbedBuilder()
					.setColor('Blurple')
					.setAuthor({ name: "Bolsa de valores", iconURL: client.user.avatarURL() })
					.setDescription(`A bolsa de valores está atualmente em **\`${herc.bolsaValores}%\`**.`)
					.setTimestamp()
				] })
			}
		}

		if(interaction.options._group === "trabalho") {
			if(interaction.options._subcommand === "cancelar") {
				if(user.emQuestao == true) return interaction.reply({ ephemeral: true, content: `Responda a questão (S ou N) que está sendo pedida antes de utilizar o comando.` })
				const trabalhoEmProgresso = herc.trabalhosAtivos.find(trabalho => trabalho.trabalhadorID == interaction.user.id)

				if(!trabalhoEmProgresso) 
				return interaction.reply({ ephemeral: true, content: `Você não está trabalhando. Utilize </economia trabalho trabalhar:1059566494381514842> para trabalhar.` })

				const trabalhoEmProgressoIndex = herc.trabalhosAtivos.findIndex(trabalho => trabalho.trabalhadorID == interaction.user.id)

				user.emQuestao = true
				await user.save()
				interaction.reply(
					{ 
						ephemeral: true, 
						content: 
						`
						Ao cancelar o trabalho ativo você perderá todo o progresso já feito e não receberá nada.\nEnvie **S** para continuar ou **N** para cancelar o processo.
						` 
					}
				)
				.then(msg => {
					const filter = m => m.author.id == interaction.user.id && (m.content.toLowerCase().startsWith('s') || m.content.toLowerCase().startsWith('n'))
					interaction.channel.awaitMessages({ filter, max: 1 })
					.then(async coletado => {
						coletado.first().delete()

						if(coletado.first().content.toLowerCase().startsWith('n')) {
							interaction.followUp({ ephemeral: true, content: 'Processo cancelado.' })
							user.emQuestao = false
							await user.save()
							return
						}

						await herc.trabalhosAtivos.splice(trabalhoEmProgressoIndex, 1)
						await herc.save()

						await interaction.followUp({ ephemeral: true, content: `Você cancelou seu trabalho.` })
						user.emQuestao = false
						user.economia.trabalhando = false
						await user.save()
					})
				})
			}

			if(interaction.options._subcommand === "trabalhar") {
				if(user.emQuestao == true) return interaction.reply({ ephemeral: true, content: `Responda a questão (S ou N) que está sendo pedida antes de utilizar o comando.` })
				const trabalhoEmProgresso = herc.trabalhosAtivos.find(trabalho => trabalho.trabalhadorID == interaction.user.id)
				if(trabalhoEmProgresso) 
				return interaction.reply({ ephemeral: true, content: 'Você já está trabalhando, acompanhe o progresso em </economia trabalho progresso:1059566494381514842>' })

				const tempo = interaction.options.getInteger('tempo') || 0.5
				const tempoUI = tempo==0.5?'30 minutos':`${tempo} horas`

				const ganhos = tempo*30

				user.emQuestao = true
				await user.save()
				interaction.reply(
					{ 
						ephemeral: true, 
						content: 
						`
						Você irá trabalhar por **\`${tempoUI}\`** e receberá **\`$${ganhos}\`**.\nEnvie **S** para continuar ou **N** para cancelar o processo.
						` 
					}
				)
				.then(msg => {
					const filter = m => m.author.id == interaction.user.id && (m.content.toLowerCase().startsWith('s') || m.content.toLowerCase().startsWith('n'))
					interaction.channel.awaitMessages({ filter, max: 1 })
					.then(async coletado => {
						coletado.first().delete()

						if(coletado.first().content.toLowerCase().startsWith('n')) {
							interaction.followUp({ ephemeral: true, content: 'Processo cancelado.' })
							user.emQuestao = false
							await user.save()
							return
						}

						await herc.trabalhosAtivos.push({ trabalhadorID: interaction.user.id, comecou: Date.now(), tempo, ganhos })
						await herc.save()

						await interaction.followUp({ ephemeral: true, content: `Você agora está trabalhando. Utilize </economia trabalho progresso:1059566494381514842> para acompanhar seu progresso!` })
						user.emQuestao = false
						user.economia.trabalhando = true
						await user.save()
					})
				})
			}

			if(interaction.options._subcommand === "progresso") {
				const trabalhoEmProgresso = herc.trabalhosAtivos.find(trabalho => trabalho.trabalhadorID == interaction.user.id)

				if(!trabalhoEmProgresso) 
				return interaction.reply({ ephemeral: true, content: `Você não está trabalhando. Utilize </economia trabalho trabalhar:1059566494381514842> para trabalhar.` })

				const barraProgresso = new cliProgress.SingleBar({ format: '{bar}' }, cliProgress.Presets.shades_classic)

				const tempoTotalMinutos = trabalhoEmProgresso.tempo*60
				const tempoPercorrido = Math.floor((Date.now() - trabalhoEmProgresso.comecou) / (1000*60)) //minutos
				const tempoRestante = tempoTotalMinutos - tempoPercorrido //minutos

				const tempoTotalUI = trabalhoEmProgresso.tempo==0.5?`30 minutos`:`${trabalhoEmProgresso.tempo} horas (${tempoTotalMinutos} minutos)`

				barraProgresso.start(tempoTotalMinutos, tempoPercorrido)

				return interaction.reply({ ephemeral: true, embeds: [
					new EmbedBuilder()
					.setColor('Blurple')
					.setAuthor({ name: "Progresso no trabalho", iconURL: interaction.user.avatarURL() })
					.setDescription(`Utilize </economia trabalho cancelar:1059566494381514842> para cancelar o trabalho que está fazendo.`)
					.addFields([
						{
							name: 'Informações do trabalho:',
							value: 
							`
							Tempo percorrido: **${tempoPercorrido} ${tempoPercorrido<=1?'minuto':'minutos'}**
							Tempo restante: **${tempoRestante} ${tempoRestante<=1?'minuto':'minutos'}**
							Tempo total: **${tempoTotalUI}**
							Dinheiro a receber: **$${trabalhoEmProgresso.ganhos}**
							`
						}
					])
					.setFooter({ text: `${barraProgresso.lastDrawnString}` })
				] })
			}
		}

		if(interaction.options._group === "cheque") {
			if(interaction.options._subcommand === "usar") {
				await interaction.deferReply({ ephemeral: true })

				const codigoCheque = interaction.options.get('codigo').value

				const chequeDB = herc.listaCheques.find(cheque => cheque.chequeCodigo == codigoCheque)

				if(!chequeDB) return interaction.editReply(`Não foi possível encontrar um cheque com esse código, verifique se digitou corretamente.`)

				const chequeDB_index = herc.listaCheques.findIndex(cheque => cheque.chequeCodigo == codigoCheque)

				herc.listaCheques.splice(chequeDB_index, 1)
				user.economia.banco.saldo+=chequeDB.chequeValor
				await herc.save()
				await user.save()
				await interaction.editReply(`Cheque utilizado com sucesso. **$${chequeDB.chequeValor}** foram adicionados à sua conta do banco.`)
			}

			if(interaction.options._subcommand === "listar") {
				await interaction.deferReply({ ephemeral: true })

				const chequesCriados = herc.listaCheques.filter(cheque => cheque.criadorID == interaction.user.id)
				if(chequesCriados.length == 0) return interaction.editReply('Você não possui nenhum cheque ativo no momento.')

				const cheques_aMostrar = []

				for(let i = 0; i < chequesCriados.length; i++) {
					cheques_aMostrar.push(`${chequesCriados[i].chequeCodigo} | $${chequesCriados[i].chequeValor}`)
				}

				await interaction.editReply({ embeds: [
					new EmbedBuilder()
					.setColor('Blurple')
					.setAuthor({ name: 'Cheques criados', iconURL: interaction.user.avatarURL() })
					.setDescription(`\`\`\`${cheques_aMostrar.join('\n')}\`\`\``)
				] })
			}

			if(interaction.options._subcommand === "criar") {
				await interaction.deferReply({ ephemeral: true })

				const valor = interaction.options.get('valor').value
				
				if(valor > user.economia.banco.saldo) return interaction.editReply('Você não tem saldo suficiente em sua conta do banco para criar esse cheque!')

				user.economia.banco.saldo-=valor
				await herc.listaCheques.push(
					{
						chequeCodigo: `CHEQUE-${randomUUID()}`,
						chequeValor: valor,
						criadorID: `${interaction.user.id}`
					}
				)
				await user.save()
				await herc.save()
				await interaction.editReply(`Você criou um cheque com sucesso!`)
			}
		}

		if(interaction.options._group === "banco") {
			if(interaction.options._subcommand === "sacar") {
				await interaction.deferReply({ ephemeral: true })
				const aSacar = interaction.options.get('valor').value

				if(aSacar > user.economia.banco.saldo) return interaction.editReply('Você não tem saldo suficiente para sacar!')

				user.economia.banco.saldo-=aSacar
				user.economia.carteira.saldo+=aSacar
				await user.save()
				await interaction.editReply(`Foi sacado \`$${aSacar}\` de sua conta bancária.`)
			}

			if(interaction.options._subcommand === "depositar") {
				await interaction.deferReply({ ephemeral: true })
				const aDepositar = interaction.options.get('valor').value

				if(aDepositar > user.economia.carteira.saldo) return interaction.editReply('Você não tem saldo suficiente para depositar!')
				
				user.economia.carteira.saldo-=aDepositar
				user.economia.banco.saldo+=aDepositar
				await user.save()
				await interaction.editReply(`Foi depositado \`$${aDepositar}\` em sua conta bancária.`)
			}

			if(interaction.options._subcommand === "ver") {
				await interaction.deferReply({ ephemeral: true })
				await interaction.editReply({ embeds: [
					new EmbedBuilder()
					.setColor('Blurple')
					.setAuthor({ name: 'Conta bancária', iconURL: interaction.user.avatarURL() })
					.setDescription(
						`
						Saldo atual: **\`$${user.economia.banco.saldo}\`**
						`
					)
					.addFields([
						{
							name: "Identificação da conta:",
							value: `\`${user.economia.banco.id}\`\n*Utilize essa identificação para realizar transações anônimas.*`,
							inline: true
						}
					])
					.setTimestamp(Date.now())
				] })
			}
		}

		if(interaction.options._group === "carteira") {
			if(interaction.options._subcommand === "ver") {
				await interaction.deferReply({ ephemeral: true })
				await interaction.editReply({ embeds: [
					new EmbedBuilder()
					.setColor('Blurple')
					.setAuthor({ name: 'Carteira', iconURL: interaction.user.avatarURL() })
					.setDescription(
						`
						Saldo atual: **\`$${user.economia.carteira.saldo}\`**
						`
					)
					.setTimestamp(Date.now())
				] })
			}
		} 
    }
}