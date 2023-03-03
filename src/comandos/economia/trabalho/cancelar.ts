import { ChatInputCommandInteraction, Message, TextChannel } from "discord.js";
import { client } from "../../..";
import Herc from "../../../models/Herc";
import User from "../../../models/User";

export default async function (interaction: ChatInputCommandInteraction) {
  const herc = (await Herc.findOne({ id: process.env.CLIENT_ID }))!;
  const user = (await User.findOne({ _id: interaction.user.id }))!;

  if (client.tempBase.get(`${interaction.user.id}_emQuestao`) == true)
    return interaction.reply({
      ephemeral: true,
      content: `Responda a questão (S ou N) que está sendo pedida antes de utilizar o comando.`,
    });
  const trabalhoEmProgresso = herc.trabalhosAtivos.find((trabalho) => trabalho.trabalhadorID == interaction.user.id);

  if (!trabalhoEmProgresso)
    return interaction.reply({
      ephemeral: true,
      content: `Você não está trabalhando. Utilize </economia trabalho trabalhar:1062381516119879766> para trabalhar.`,
    });

  const trabalhoEmProgressoIndex = herc.trabalhosAtivos.findIndex((trabalho) => trabalho.trabalhadorID == interaction.user.id);

  client.tempBase.set(`${interaction.user.id}_emQuestao`, true);
  await user.save();

  interaction
    .reply({
      ephemeral: true,
      content: `
        Ao cancelar o trabalho ativo você perderá todo o progresso já feito e não receberá nada.\nEnvie **S** para continuar ou **N** para cancelar o processo.
        `,
    })
    .then(() => {
      const filter = (m: Message) => m.author.id == interaction.user.id && (m.content.toLowerCase().startsWith("s") || m.content.toLowerCase().startsWith("n"));
      (interaction.channel as TextChannel).awaitMessages({ filter, max: 1 }).then(async (coletado) => {
        coletado.first()?.delete();

        if (coletado.first()?.content.toLowerCase().startsWith("n")) {
          interaction.followUp({
            ephemeral: true,
            content: "Processo cancelado.",
          });
          client.tempBase.set(`${interaction.user.id}_emQuestao`, false);
          await user.save();
          return;
        }

        herc.trabalhosAtivos.splice(trabalhoEmProgressoIndex, 1);
        await herc.save();

        await interaction.followUp({
          ephemeral: true,
          content: `Você cancelou seu trabalho.`,
        });
        client.tempBase.set(`${interaction.user.id}_emQuestao`, false);
        user.economia.trabalhando = false;
        await user.save();
      });
    });
}
