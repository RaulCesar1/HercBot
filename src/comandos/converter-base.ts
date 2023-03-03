import { AttachmentBuilder, ChatInputCommandInteraction, codeBlock, SlashCommandBuilder } from "discord.js";
import converterBase from "../functions/converterBase";
import errorEmbedGenerate from "../responseMessages/errorEmbedGenerate";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("converter-base")
    .setDescription("Converta números da base decimal para outras bases.")
    .addIntegerOption((option) => option.setName("decimal").setDescription("Número em base decimal que será convertido.").setMinValue(1).setRequired(true))
    .addIntegerOption((option) => option.setName("para-base").setDescription("Para qual base o número será convertido. Ex: 2 (base binária)").setMinValue(2).setMaxValue(9).setRequired(true)),
  async executar(interaction: ChatInputCommandInteraction) {
    const numeroDecimal: number = interaction.options.getInteger("decimal") as number;
    const paraBase: number = interaction.options.getInteger("para-base") as number;

    if (numeroDecimal < paraBase)
      return interaction.reply({
        ephemeral: true,
        embeds: [errorEmbedGenerate("O número decimal deve ser maior ou igual a base para qual será convertido.")],
      });

    const convertido = converterBase(numeroDecimal, paraBase);

    const arquivo = new AttachmentBuilder(Buffer.from(convertido[1], "latin1"), { name: "calculo.txt" });

    await interaction.reply({
      ephemeral: true,
      files: [arquivo],
      content: `${codeBlock(`${numeroDecimal} -> base ${paraBase} = ${convertido[0]}`)}`,
    });
  },
};
