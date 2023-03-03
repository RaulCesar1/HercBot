import { ChatInputCommandInteraction, EmbedBuilder, inlineCode, SlashCommandBuilder } from "discord.js";
import { client } from "..";

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Mostra o ping do bot."),
  async executar(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      ephemeral: true,
      embeds: [new EmbedBuilder().setDescription(`**Ping do bot: ${inlineCode(`${client.ws.ping}ms`)}**`).setColor("Blurple")],
    });
  },
};
