import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, TextChannel, userMention } from "discord.js";
import { client } from "..";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reportar")
    .setDescription("Comando para reportar um problema ou enviar uma sugestão. (sobre o bot)")
    .addStringOption((option) => option.setName("report").setDescription("Problema ou sugestão que está reportando.").setRequired(true)),
  async executar(interaction: ChatInputCommandInteraction) {
    (client.channels.cache.get(process.env.CANAL_REPORTS as string) as TextChannel)
      .send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setDescription(interaction.options.getString("report"))
            .setFooter({
              text: `Report enviado por ${interaction.user.tag} (${interaction.user.id})`,
              iconURL: interaction.user.avatarURL() as string,
            })
            .setTimestamp(),
        ],
      })
      .then(() => {
        interaction.reply({
          content: `Enviado! Obrigado ${userMention(interaction.user.id)}!`,
          ephemeral: true,
        });
      });
  },
};
