require('dotenv').config()
const { ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js')
const Ticket = require('../ticket/Ticket.js')
const { commandos } = require('../commandHandler.js')

module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, client) {
        if (interaction.user.bot === true) return

        try {
            var lf = require(`../lang/${interaction.locale}.json`)
        } catch (e) {
            if (!lf) lf = require(`../lang/en-US.json`)
        }

        // ticket command
        if(interaction.customId === "ticket-create") {
            try {
                let AssuntoPrincipal = interaction.components[0].components[0].value
                let Descricao = interaction.components[1].components[0].value

                let newTicket = new Ticket(AssuntoPrincipal, Descricao)

                let categoriaTickets = interaction.guild.channels.cache.get(process.env.CATEGORIA_TICKETS)
                let role1 = interaction.guild.roles.cache.get('836966017351548979')
                let role2 = interaction.guild.roles.cache.get('848211958096592936')

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

                let permRoles = [role1, role2]

                function exPerms() {
                    for(let i = 0; i < permRoles.length; i++) {
                        permOver.push(
                            {
                                id: permRoles[i],
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
                    reason: `Ticket criado por ${interaction.user.tag}`,
                    permissionOverwrites: permOver
                }).then(async ticketPrivado => {
                    let embedAssuntoPrincipal = new EmbedBuilder()
                        .setDescription(`\`\`\`${AssuntoPrincipal}\`\`\``)
                        .setColor("Orange")

                    let embedDescricao = new EmbedBuilder()
                        .setDescription(`\`\`\`${Descricao}\`\`\``)
                        .setColor("Orange")

                    let embedInfo = new EmbedBuilder()
                        .setDescription(`
                            **\`#${newTicket.id}\`**
                            Ticket criado por: **${interaction.user.tag}**
                            ID do usuário: **${interaction.user.id}**
                        `)
                        .setFooter({ text: 'Para fechar o ticket, utilize: /ticket close' })
                        .setColor('Orange')

                    await ticketPrivado.send({ embeds: [embedAssuntoPrincipal, embedDescricao] })
                    await ticketPrivado.send({ embeds: [embedInfo] })
                    await interaction.reply({ content: `Ticket criado com sucesso! <#${ticketPrivado.id}>`, ephemeral: true })
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