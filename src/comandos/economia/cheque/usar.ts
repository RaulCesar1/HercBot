import { ChatInputCommandInteraction } from "discord.js";
import Herc from "../../../models/Herc";
import User from "../../../models/User";
import errorEmbedGenerate from "../../../responseMessages/errorEmbedGenerate";

export default async function (interaction: ChatInputCommandInteraction) {
  const herc = (await Herc.findOne({ id: process.env.CLIENT_ID }))!;
  const user = (await User.findOne({ _id: interaction.user.id }))!;

  await interaction.deferReply({ ephemeral: true });

  const codigoCheque: string = interaction.options.getString("codigo") as string;

  const chequeDB = herc.listaCheques.find((cheque) => cheque.chequeCodigo == codigoCheque);

  if (!chequeDB)
    return interaction.editReply({
      embeds: [errorEmbedGenerate("Não foi possível encontrar um cheque com esse código, verifique se digitou corretamente.")],
    });

  const chequeDB_index = herc.listaCheques.findIndex((cheque) => cheque.chequeCodigo == codigoCheque);

  herc.listaCheques.splice(chequeDB_index, 1);
  user.economia.banco.saldo += chequeDB.chequeValor;
  await herc.save();
  await user.save();
  await interaction.editReply(`Cheque utilizado com sucesso. **$${chequeDB.chequeValor}** foram adicionados à sua conta do banco.`);
}
