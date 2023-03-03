import { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import Guild from "../models/Guild";
import errorEmbedGenerate from "../responseMessages/errorEmbedGenerate";
import successEmbedGenerate from "../responseMessages/successEmbedGenerate";

export default async function (interaction: MessageComponentInteraction) {
  const guild = await Guild.findOne({ _id: interaction.guildId });

  try {
    const categoriaID = (interaction as unknown as ModalSubmitInteraction).fields.getTextInputValue("__a");

    const toVerify = interaction.guild?.channels.cache.get(categoriaID) || false;

    if (toVerify && categoriaID == guild?.callsCategoria)
      return interaction.reply({
        ephemeral: true,
        embeds: [errorEmbedGenerate("Essa categoria já está definida como a categoria de calls privadas.")],
      });

    if (toVerify == false)
      return interaction.reply({
        ephemeral: true,
        embeds: [errorEmbedGenerate("O ID inserido é inválido!")],
      });

    if (toVerify.type !== 4)
      return interaction.reply({
        ephemeral: true,
        embeds: [errorEmbedGenerate("O ID inserido precisa ser de uma categoria de canais.")],
      });

    guild!.callsCategoria = categoriaID;
    await guild?.save();
    await interaction.reply({
      ephemeral: true,
      embeds: [successEmbedGenerate("A categoria de calls privadas foi atualizada!")],
    });
  } catch (e) {
    console.error(e);
  }
}
