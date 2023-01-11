require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const cliProgress = require('cli-progress')
const User = require('../models/User.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('xp')
		.setDescription('Comandos de XP do bot.')
		.addSubcommand(sub =>
			sub.setName('nivel')
			.setDescription('Veja o seu nível de XP ou de outro usuário.')	
			.addUserOption(op => 
				op.setName('usuario')
				.setDescription('Usuário para ver o nível de XP.')	
			)
		)
		.addSubcommand(sub =>
			sub.setName('rank')
			.setDescription('Veja o rank dos usuários com mais XP.')	
		),
	async execute(interaction, client, guild, herc, user) {
		if(interaction.options._subcommand === "nivel") {
			const userM = interaction.options.getUser('usuario') || interaction.user
			const userMDB = await User.findOne({ _id: userM.id })

			if(!userMDB || userMDB == null) return interaction.reply({ ephemeral: true, content: `Não foi possível encontrar informações sobre o nível desse usuário. Talvez ele ainda não tenha sido registrado no meu banco de dados!` })

			const xpNecessario = 50*userMDB.xp.level
			const xpFaltando = xpNecessario - userMDB.xp.xp

			const barraProgresso = new cliProgress.SingleBar({
				format: '{bar}'
			}, cliProgress.Presets.shades_classic)

			barraProgresso.start(xpNecessario, userMDB.xp.xp)

			return interaction.reply({ ephemeral: true, embeds: [
				new EmbedBuilder()
				.setColor('Blurple')
				.setAuthor({ name: `${userM.tag}`, iconURL: userM.avatarURL() })
				.setDescription(`
				Nível: **${userMDB.xp.level}**
				Posição no Rank: **#${userMDB.xp.rankPos}**
				`)
				.addFields([
					{
						name: '\u200b',
						value: 
						`
						**XP atual:** \`${userMDB.xp.xp}/${xpNecessario}\`
						**XP total:** \`${((((userMDB.xp.level-1)*25)*userMDB.xp.level)+userMDB.xp.xp)}\`
						Ainda faltam **\`${xpFaltando}\`** de XP para atingir o nível **\`${userMDB.xp.level+1}\`**
						`
					}
				])
				.setFooter({ text: `${barraProgresso.lastDrawnString}` })
			] })
		}

		if(interaction.options._subcommand === "rank") {
			await interaction.deferReply({ ephemeral: true })

			const xpRanking = herc.xpRanking
			var aMostrar = []
			for(let i = 0; i < 10; i++) {
				try {
					var usa = await User.findOne({ _id: xpRanking[i][0] })
					var xpAcumulado = ((((usa.xp.level-1)*25)*usa.xp.level)+usa.xp.xp)
					var usaLevel = usa.xp.level
				} catch {
					usa = false
				}
				
				aMostrar.push(`#${i+1} ${usa==false?'Não definido':`${usa.userTag}: < ${xpAcumulado} | ${usaLevel} >`}`)
			}

			const embedRanking = new EmbedBuilder()
			.setColor('Blurple')
			.setAuthor({ name: 'Ranking de usuários por XP', iconURL: client.user.avatarURL() })
			.setDescription(`\`\`\`${aMostrar.join('\n')}\`\`\``)
			.setFooter({ text: `Sua posição no rank: #${user.xp.rankPos}`, iconURL: interaction.user.avatarURL() })

			await interaction.editReply({ embeds: [embedRanking] })
		}

    }
}