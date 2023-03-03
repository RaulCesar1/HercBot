import { MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import { client } from "..";
import User from "../models/User";

export default async function (interaction: MessageComponentInteraction) {
  try {
    const user = await User.findOne({ _id: interaction.user.id });

    const interactionMessageComponent = interaction as unknown as ModalSubmitInteraction;

    const Anotacao = interactionMessageComponent.fields.getTextInputValue("__a");

    const anotacaoId: number = client.tempBase.get(`${interaction.user.id}_tempAnotacaoModificar`) as number;

    const anotacaoIndex = user?.anotacoes?.findIndex((x) => x.id == anotacaoId);
    const anotacao = user?.anotacoes?.find((x) => x.id == anotacaoId);

    const titulo = anotacao?.titulo;

    user?.anotacoes?.splice(anotacaoIndex as number, 1);

    user?.anotacoes?.push({
      titulo: titulo as string,
      texto: Anotacao,
      alteradaEm: Date.now(),
      id: anotacaoId,
    });

    await user?.save();

    await interaction.reply({
      ephemeral: true,
      content: `Anotação modificada com sucesso!`,
    });
  } catch (e) {
    console.error(e);
    interaction.reply({
      ephemeral: true,
      content: "Não foi possível modificar essa anotação.",
    });
  }
}
