import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { client } from "..";

const pack = require("../../package.json");

module.exports = {
  data: new SlashCommandBuilder().setName("sobre").setDescription("Mostra informações sobre o bot."),
  async executar(interaction: ChatInputCommandInteraction) {
    const botoes = new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setURL("https://github.com/RaulCesar1/HercBot").setLabel("Github"), new ButtonBuilder().setStyle(ButtonStyle.Link).setURL("https://twitter.com/RaulCsrOliveira").setLabel("Twitter"));

    const embed = new EmbedBuilder()
      .setDescription(
        `
            **Herc** é um bot com variadas funções, como um sistema de economia, criação de tíquetes e calls privadas, entre outras.\n
            Feito por **Raul César**, o bot foi desenvolvido utilizando **Node.js** com **Discord.js** e **TypeScript**.
            `
      )
      .setFooter({
        text: `Versão ${pack.version} | Sinta-se livre para utiliza-lo em seu servidor.`,
      })
      .setThumbnail(client.user?.avatarURL() as string)
      .setColor("Blurple");

    interaction.reply({
      ephemeral: true,
      embeds: [embed],
      components: [botoes],
    });
  },
};
