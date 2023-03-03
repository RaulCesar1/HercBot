import { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import User from "../models/User";

export default async function (interaction: MessageComponentInteraction) {
  const user = await User.findOne({ _id: interaction.user.id });

  const gerarId = (anotacoesLength: number): number => {
    var anotacaoId: number = anotacoesLength + 1;
    if (user?.anotacoes?.find((x) => x.id == anotacaoId)) return gerarId(anotacoesLength + 1);
    return anotacaoId;
  };

  try {
    const Anotacao = (interaction as unknown as ModalSubmitInteraction).fields.getTextInputValue("__b");
    const Titulo = (interaction as unknown as ModalSubmitInteraction).fields.getTextInputValue("__a");

    const anotacaoId = gerarId(user!.anotacoes!.length);

    user?.anotacoes?.push({
      titulo: Titulo,
      texto: Anotacao,
      alteradaEm: Date.now(),
      id: anotacaoId,
    });

    await user?.save();
    await interaction.reply({
      ephemeral: true,
      content: `Anotação criada com sucesso! Utilize /anotações listar para ver suas anotações.\nID: **${anotacaoId}**`,
    });
  } catch (e) {
    console.error(e);
    interaction.reply({
      ephemeral: true,
      content: "Não foi possível criar essa anotação.",
    });
  }
}
