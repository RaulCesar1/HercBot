require('dotenv').config()
const { ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js')
const Ticket = require('../ticket/Ticket.js')
const { commandos } = require('../commandHandler.js')
const Herc = require('../models/Herc.js')
const Guild = require('../models/Guild.js')

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
        if (interaction.guildId == null) return
        if (interaction.user.bot === true) return

        const herc = await Herc.findOne({ id: process.env.CLIENT_ID })
        const guild = await Guild.findOne({ _id: interaction.guildId })

        try {
            var lf = require(`../lang/${interaction.locale}.json`)
        } catch (e) {
            if (!lf) lf = require(`../lang/en-US.json`)
        }

        if(herc.manutencao == true && interaction.user.id !== "693929568020725843") return interaction.reply({ content: lf["manutencao"], ephemeral: true })

        if(interaction.customId === "toggleManutencao") {
            herc.manutencao = herc.manutencao==true?false:true
            await herc.save()
            await interaction.reply({ content: herc.manutencao==false?'Manutenção desativada!':'Manutenção ativada!', ephemeral: true })
        }

        if(interaction.customId === "ticket-create") {
            try {
                let AssuntoPrincipal = interaction.components[0].components[0].value
                let Descricao = interaction.components[1].components[0].value

                let newTicket = new Ticket(AssuntoPrincipal, Descricao)

                let categoriaTickets = guild?.tokenCategory

                let permOver = [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.SendMessages
                        ],
                    },
                ]

                function exPerms() {
                    let permMembs = interaction.guild.members.cache.filter(m => m.permissions.has(PermissionsBitField.Flags.ManageMessages)).map(m => m.id)

                    for(let i = 0; i < permMembs.length; i++) {
                        permOver.push(
                            {
                                id: permMembs[i],
                                allow: [
                                    PermissionsBitField.Flags.ViewChannel,
                                    PermissionsBitField.Flags.SendMessages
                                ],
                            },
                        )
                    }
                }
                exPerms()

                interaction.guild.channels.create({
                    name: `ticket-${newTicket.id}`,
                    parent: categoriaTickets,
                    type: ChannelType.GuildText,
                    reason: `${lf["ticket_12"].replace('>iut', interaction.user.tag)}`,
                    permissionOverwrites: permOver
                }).then(async ticketPrivado => {
                    let embedAssuntoPrincipal = new EmbedBuilder()
                        .setDescription(`\`\`\`${AssuntoPrincipal}\`\`\``)
                        .setColor("Red")

                    let embedDescricao = new EmbedBuilder()
                        .setDescription(`\`\`\`${Descricao}\`\`\``)
                        .setColor("Red")

                    let embedInfo = new EmbedBuilder()
                        .setDescription(`
                            **\`#${newTicket.id}\`**
                            ${lf["ticket_12"].replace('>iut', interaction.user.tag)}
                            ${lf["ticket_13"].replace('>iuid', interaction.user.id)}
                        `)
                        .setFooter({ text: lf["ticket_14"] })
                        .setColor('Red')

                    await ticketPrivado.send({ embeds: [embedAssuntoPrincipal, embedDescricao] })
                    await ticketPrivado.send({ embeds: [embedInfo] })
                    await interaction.reply({ content: lf["ticket_15"].replace('>tid', ticketPrivado.id), ephemeral: true })
                })
            } catch(e) {
                console.log(e)
            }
            return
        }

        let command = commandos.get(interaction.commandName)

        if (!command) return

        // Executar Comando

        try {
            await command.execute(interaction, client, lf)
        } catch (error) {
            console.error(error)
            await interaction.reply({
                content: 'An error occurred while executing this command!',
                ephemeral: true,
            })
        }
	},
};