import { ChatInputCommandInteraction } from "discord.js";
import User from "../../../models/User";
import errorEmbedGenerate from "../../../responseMessages/errorEmbedGenerate";

export default async function (interaction: ChatInputCommandInteraction) {
  const user = (await User.findOne({ _id: interaction.user.id }))!;

  await interaction.deferReply({ ephemeral: true });
  const aDepositar: number = interaction.options.getInteger("valor") as number;

  if (aDepositar > user.economia.carteira.saldo)
    return interaction.editReply({
      embeds: [errorEmbedGenerate("Você não tem saldo suficiente para depositar!")],
    });

  user.economia.carteira.saldo -= aDepositar;
  user.economia.banco.saldo += aDepositar;
  await user.save();
  await interaction.editReply(`Foi depositado \`$${aDepositar}\` em sua conta bancária.`);
}
