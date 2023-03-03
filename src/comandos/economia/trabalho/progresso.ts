import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import Herc from "../../../models/Herc";

export default async function (interaction: ChatInputCommandInteraction) {
  const herc = (await Herc.findOne({ id: process.env.CLIENT_ID }))!;

  const trabalhoEmProgresso = herc.trabalhosAtivos.find((trabalho) => trabalho.trabalhadorID == interaction.user.id);

  if (!trabalhoEmProgresso)
    return interaction.reply({
      ephemeral: true,
      content: `Você não está trabalhando. Utilize /economia trabalho trabalhar para trabalhar.`,
    });

  const tempoTotalMinutos = trabalhoEmProgresso.tempo * 60;
  const tempoPercorrido = Math.floor((Date.now() - trabalhoEmProgresso.comecou) / (1000 * 60)); //minutos
  const tempoRestante = tempoTotalMinutos - tempoPercorrido; //minutos

  const tempoTotalUI = trabalhoEmProgresso.tempo == 0.5 ? `30 minutos` : `${trabalhoEmProgresso.tempo} horas (${tempoTotalMinutos} minutos)`;

  return interaction.reply({
    ephemeral: true,
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({
          name: "Progresso no trabalho",
          iconURL: interaction.user.avatarURL() as string,
        })
        .setDescription(`Utilize /economia trabalho cancelar para cancelar o trabalho que está fazendo.`)
        .addFields([
          {
            name: "Informações do trabalho:",
            value: `
                Tempo percorrido: **${tempoPercorrido} ${tempoPercorrido <= 1 ? "minuto" : "minutos"}**
                Tempo restante: **${tempoRestante} ${tempoRestante <= 1 ? "minuto" : "minutos"}**
                Tempo total: **${tempoTotalUI}**
                Dinheiro a receber: **$${trabalhoEmProgresso.ganhos}**
                `,
          },
        ]),
    ],
  });
}
