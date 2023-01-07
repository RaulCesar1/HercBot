const Ticket = require('../../utils/Ticket.js')
const { ChannelType, PermissionsBitField, EmbedBuilder } = require('discord.js')

exports.execute = async function(interaction, guild) {
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
            reason: `Ticket criado por: **${interaction.user.tag}**`,
            permissionOverwrites: permOver
        }).then(async ticketPrivado => {
            let embedAssuntoPrincipal = new EmbedBuilder()
                .setDescription(`\`\`\`${AssuntoPrincipal}\`\`\``)
                .setColor("Blurple")

            let embedDescricao = new EmbedBuilder()
                .setDescription(`\`\`\`${Descricao}\`\`\``)
                .setColor("Blurple")

            let embedInfo = new EmbedBuilder()
                .setDescription(`
                    **\`#${newTicket.id}\`**
                    Ticket criado por: **${interaction.user.tag}**
                    ID do usuário: **${interaction.user.id}**
                `)
                .setFooter({ text: "Para fechar o ticket, utilize: /ticket fechar" })
                .setColor('Blurple')

            await ticketPrivado.send({ embeds: [embedAssuntoPrincipal, embedDescricao] })
            await ticketPrivado.send({ embeds: [embedInfo] })
            await interaction.reply({ content: `Ticket criado com sucesso! <#${ticketPrivado.id}>`, ephemeral: true })
        })
    } catch(e) {
        console.log(e)
    }
}