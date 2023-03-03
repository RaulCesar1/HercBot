import { randomUUID } from "crypto";
import { ChatInputCommandInteraction } from "discord.js";
import Herc from "../../../models/Herc";
import User from "../../../models/User";
import errorEmbedGenerate from "../../../responseMessages/errorEmbedGenerate";

export default async function (interaction: ChatInputCommandInteraction) {
  const herc = (await Herc.findOne({ id: process.env.CLIENT_ID }))!;
  const user = (await User.findOne({ _id: interaction.user.id }))!;

  await interaction.deferReply({ ephemeral: true });

  const valor: number = interaction.options.getInteger("valor") as number;

  if (valor > user.economia.banco.saldo)
    return interaction.editReply({
      embeds: [errorEmbedGenerate("Você não tem saldo suficiente em sua conta do banco para criar esse cheque!")],
    });

  user.economia.banco.saldo -= valor;
  herc.listaCheques.push({
    chequeCodigo: `CHEQUE-${randomUUID()}`,
    chequeValor: valor,
    criadorID: `${interaction.user.id}`,
  });
  await user.save();
  await herc.save();
  await interaction.editReply(`Você criou um cheque com sucesso!`);
}
