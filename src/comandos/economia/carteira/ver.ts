import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import User from "../../../models/User";

export default async function (interaction: ChatInputCommandInteraction) {
  const user = (await User.findOne({ _id: interaction.user.id }))!;

  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({
          name: "Carteira",
          iconURL: interaction.user.avatarURL() as string,
        })
        .setDescription(
          `
						Saldo atual: **\`$${user.economia.carteira.saldo}\`**
						`
        )
        .setTimestamp(Date.now()),
    ],
  });
}
