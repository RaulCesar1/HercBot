import { ActionRowBuilder, ChatInputCommandInteraction, ModalActionRowComponentBuilder, ModalBuilder, PermissionsBitField, SlashCommandBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js";

import { client } from "..";

import Guild from "../models/Guild";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tiquete")
    .setDescription("Comandos relacionados aos tíquetes de suporte.")
    .addSubcommand((sub) => sub.setName("abrir").setDescription("Abre um tíquete de suporte."))
    .addSubcommand((sub) => sub.setName("fechar").setDescription("Fecha o tíquete de suporte em aberto.")),
  async executar(interaction: ChatInputCommandInteraction) {
    const guilda = await Guild.findOne({ _id: interaction.guildId });
    const tokenCategoria = guilda?.tokenCategory;

    if (interaction.options.getSubcommand() === "fechar") {
      if (!(interaction.member?.permissions as Readonly<PermissionsBitField>).has(PermissionsBitField.Flags.ManageChannels))
        return interaction.reply({
          content: `Sem permissão.`,
          ephemeral: true,
        });

      let canalTiquete: TextChannel = client.channels.cache.get(interaction.channelId) as TextChannel;

      if (canalTiquete.parentId !== tokenCategoria)
        return interaction.reply({
          content: `Utilize este comando em um canal de tíquete.`,
          ephemeral: true,
        });

      try {
        await interaction.reply({
          content: `O tíquete será fechado em 10 segundos.`,
        });
        setTimeout(async () => {
          try {
            await canalTiquete?.delete();
          } catch (e) {}
        }, 10 * 1000);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    if (interaction.options.getSubcommand() === "abrir") {
      if (!tokenCategoria)
        return interaction.reply({
          content: `Este servidor não possui uma categoria definida para a criação de tíquetes!`,
          ephemeral: true,
        });

      const Formulario: ModalBuilder = new ModalBuilder().setTitle("Tíquete").setCustomId("tiquete-criar");

      const AssuntoPrincipal: TextInputBuilder = new TextInputBuilder().setCustomId("__a").setLabel(`Assunto do Tíquete`).setMaxLength(50).setRequired(true).setStyle(TextInputStyle.Short).setMinLength(1);

      const Descricao: TextInputBuilder = new TextInputBuilder().setCustomId("__b").setLabel(`Descrição`).setRequired(true).setMaxLength(500).setStyle(TextInputStyle.Paragraph).setMinLength(1);

      const f1 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(AssuntoPrincipal);
      const f2 = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(Descricao);

      Formulario.addComponents(f1, f2);

      return await interaction.showModal(Formulario);
    }
  },
};
