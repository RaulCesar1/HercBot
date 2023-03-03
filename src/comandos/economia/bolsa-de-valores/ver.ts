import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { client } from "../../..";
import Herc from "../../../models/Herc";

export default async function (interaction: ChatInputCommandInteraction) {
  const herc = (await Herc.findOne({ id: process.env.CLIENT_ID }))!;

  return interaction.reply({
    ephemeral: true,
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setFooter({
          text: "Bolsa de valores",
          iconURL: client.user?.avatarURL() as string,
        })
        .setDescription(`A bolsa de valores está atualmente em **\`${herc.bolsaValores}%\`**.`)
        .setTimestamp(),
    ],
  });
}
