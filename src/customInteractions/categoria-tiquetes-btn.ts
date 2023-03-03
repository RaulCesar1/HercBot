import { ActionRowBuilder, MessageComponentInteraction, ModalBuilder, PermissionsBitField, TextInputBuilder, TextInputStyle } from "discord.js";
import noPermissionMessage from "../responseMessages/noPermissionMessage";

export default async function (interaction: MessageComponentInteraction) {
  if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ManageGuild))
    return interaction.reply({
      embeds: [noPermissionMessage],
      ephemeral: true,
    });

  const Formulario = new ModalBuilder().setTitle("Categoria de Tíquetes").setCustomId("categoria-tiquetes-modal");

  const NovaCategoria = new TextInputBuilder().setCustomId(`__a`).setLabel(`Insira o ID da categoria`).setRequired(true).setStyle(TextInputStyle.Short).setMinLength(1);

  const f1 = new ActionRowBuilder<TextInputBuilder>().addComponents(NovaCategoria);

  Formulario.addComponents(f1);

  return await interaction.showModal(Formulario);
}
