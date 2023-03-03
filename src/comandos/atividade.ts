import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder().setName("atividade").setDescription("Mostra o tempo de atividade do bot."),
  async executar(interaction: ChatInputCommandInteraction) {
    const converterHoras = (tempo: number): string => {
      let horas: number | string = Math.floor(tempo / 3600);
      let minutos: number | string = Math.floor((tempo - horas * 3600) / 60);
      let segundos: number | string = tempo - horas * 3600 - minutos * 60;
      segundos = Math.floor(segundos);

      if (horas < 10) horas = "0" + horas;
      if (minutos < 10) minutos = "0" + minutos;
      if (segundos < 10) segundos = "0" + segundos;
      return horas + ":" + minutos + ":" + segundos;
    };

    const uptime = converterHoras(process.uptime() as number);

    interaction.reply({
      ephemeral: true,
      embeds: [new EmbedBuilder().setTitle(uptime).setColor("Blurple")],
    });
  },
};
