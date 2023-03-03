import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import errorEmbedGenerate from "../responseMessages/errorEmbedGenerate";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("foto-de-perfil")
    .setDescription("Veja a foto de perfil de outro usuário.")
    .addUserOption((option) => option.setName("usuario").setDescription("Usuário que deseja ver a foto de perfil, deixe em branco para ver sua própria foto.")),
  async executar(interaction: ChatInputCommandInteraction) {
    const usuario = interaction.options.getUser("usuario") || interaction.user;

    try {
      const embed = new EmbedBuilder()
        .setTitle(usuario.tag)
        .setImage(
          usuario.displayAvatarURL({
            size: 4096,
            forceStatic: false,
            extension: "jpg",
          })
        )
        .setColor("Blurple");

      if (!usuario.avatarURL()) return interaction.reply({ ephemeral: true, embeds: [errorEmbedGenerate("Este usuário não possui uma foto de perfil!")] });

      interaction.reply({ ephemeral: true, embeds: [embed] });
    } catch (e) {
      console.error(e);
    }
  },
};
