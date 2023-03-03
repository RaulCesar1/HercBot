import { ChatInputCommandInteraction } from "discord.js";
import User from "../../../models/User";
import errorEmbedGenerate from "../../../responseMessages/errorEmbedGenerate";

export default async function (interaction: ChatInputCommandInteraction) {
  const user = (await User.findOne({ _id: interaction.user.id }))!;

  await interaction.deferReply({ ephemeral: true });
  const aSacar: number = interaction.options.getInteger("valor") as number;

  if (aSacar > user.economia.banco.saldo)
    return interaction.editReply({
      embeds: [errorEmbedGenerate("Você não tem saldo suficiente para sacar!")],
    });

  user.economia.banco.saldo -= aSacar;
  user.economia.carteira.saldo += aSacar;
  await user.save();
  await interaction.editReply(`Foi sacado \`$${aSacar}\` de sua conta bancária.`);
}
