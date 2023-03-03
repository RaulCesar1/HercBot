import { ChannelType, codeBlock, EmbedBuilder, MessageComponentInteraction, ModalSubmitInteraction, PermissionsBitField } from "discord.js";

import Tiquete from "../classes/Tiquete";
import Guild from "../models/Guild";

export default async function (interaction: MessageComponentInteraction) {
  const guild = await Guild.findOne({ _id: interaction.guildId });

  const interactionModalSubmit = interaction as unknown as ModalSubmitInteraction;

  const AssuntoPrincipal = interactionModalSubmit.fields.getTextInputValue("__a");
  const Descricao = interactionModalSubmit.fields.getTextInputValue("__b");

  const newTicket = new Tiquete(AssuntoPrincipal, Descricao);

  const categoriaTickets = guild?.tokenCategory;

  let permOver = [
    {
      id: interactionModalSubmit.guildId,
      deny: [PermissionsBitField.Flags.ViewChannel],
    },
    {
      id: interaction.user.id,
      allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
    },
  ];

  (async function exPerms() {
    const permMembs: string[] = interactionModalSubmit.guild?.members.cache.filter((m) => m.permissions.has(PermissionsBitField.Flags.ManageMessages)).map((m) => m.id) as string[];

    for (let i = 0; i < permMembs.length; i++) {
      permOver.push({
        id: permMembs[i],
        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
      });
    }
  })();

  interactionModalSubmit.guild?.channels
    .create({
      name: `tiquete-${newTicket.id}`,
      parent: categoriaTickets,
      type: ChannelType.GuildText,
      reason: `Tíquete criado por: **${interaction.user.tag}**`,
      permissionOverwrites: permOver as any,
    })
    .then(async (ticketPrivado) => {
      const embedAssuntoPrincipal = new EmbedBuilder().setDescription(codeBlock(AssuntoPrincipal)).setColor("Blurple");

      const embedDescricao = new EmbedBuilder().setDescription(codeBlock(Descricao)).setColor("Blurple");

      const embedInfo = new EmbedBuilder()
        .setDescription(
          `
                    **\`#${newTicket.id}\`**
                    Tíquete criado por: **${interaction.user.tag}**
                    ID do usuário: **${interaction.user.id}**
                `
        )
        .setFooter({
          text: "Para fechar o tíquete, utilize: /tiquete fechar",
        })
        .setColor("Blurple");

      await ticketPrivado.send({
        embeds: [embedAssuntoPrincipal, embedDescricao],
      });
      await ticketPrivado.send({ embeds: [embedInfo] });
      await interaction.reply({
        content: `Tíquete criado com sucesso! <#${ticketPrivado.id}>`,
        ephemeral: true,
      });
    });
}
