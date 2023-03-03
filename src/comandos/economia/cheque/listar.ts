import { ChatInputCommandInteraction, codeBlock, EmbedBuilder } from "discord.js";
import Herc from "../../../models/Herc";
import errorEmbedGenerate from "../../../responseMessages/errorEmbedGenerate";

export default async function (interaction: ChatInputCommandInteraction) {
  const herc = (await Herc.findOne({ id: process.env.CLIENT_ID }))!;

  await interaction.deferReply({ ephemeral: true });

  const chequesCriados = herc.listaCheques.filter((cheque) => cheque.criadorID == interaction.user.id);
  if (chequesCriados.length == 0)
    return interaction.editReply({
      embeds: [errorEmbedGenerate("Você não possui nenhum cheque ativo no momento.")],
    });

  const cheques_aMostrar = [];

  for (let i = 0; i < chequesCriados.length; i++) {
    cheques_aMostrar.push(`${chequesCriados[i].chequeCodigo} | $${chequesCriados[i].chequeValor}`);
  }

  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({
          name: "Cheques criados",
          iconURL: interaction.user.avatarURL() as string,
        })
        .setDescription(codeBlock(cheques_aMostrar.join("\n"))),
    ],
  });
}
