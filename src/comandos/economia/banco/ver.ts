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
          name: "Conta bancária",
          iconURL: interaction.user.avatarURL() as string,
        })
        .setDescription(
          `
						Saldo atual: **\`$${user.economia.banco.saldo}\`**
						`
        )
        .addFields([
          {
            name: "Identificação da conta:",
            value: `\`${user.economia.banco.id}\`\n*Utilize essa identificação para realizar transações anônimas.*`,
            inline: true,
          },
        ])
        .setTimestamp(Date.now()),
    ],
  });
}
