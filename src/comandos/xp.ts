import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { client } from "..";
import Herc from "../models/Herc";
import User from "../models/User";
import errorEmbedGenerate from "../responseMessages/errorEmbedGenerate";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("Comandos de XP do bot.")
    .addSubcommand((sub) =>
      sub
        .setName("nivel")
        .setDescription("Veja o seu nível de XP ou de outro usuário.")
        .addUserOption((op) => op.setName("usuario").setDescription("Usuário para ver o nível de XP."))
    )
    .addSubcommand((sub) => sub.setName("rank").setDescription("Veja o rank dos usuários com mais XP.")),
  async executar(interaction: ChatInputCommandInteraction) {
    const herc = (await Herc.findOne({ id: process.env.CLIENT_ID as string }))!;
    const user = (await User.findOne({ _id: interaction.user.id }))!;

    if (interaction.options.getSubcommand() === "nivel") {
      const userM = interaction.options.getUser("usuario") || interaction.user;
      const userMDB = await User.findOne({ _id: userM.id });

      if (!userMDB || userMDB == null)
        return interaction.reply({
          ephemeral: true,
          embeds: [errorEmbedGenerate("Não foi possível encontrar informações sobre o nível desse usuário. Talvez ele ainda não tenha sido registrado no meu banco de dados!")],
        });

      const xpNecessario = 50 * userMDB.xp.level;
      const xpFaltando = xpNecessario - userMDB.xp.xp;

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setAuthor({ name: `${userM.tag}`, iconURL: userM.avatarURL() as string })
            .setDescription(
              `
				Nível: **${userMDB.xp.level}**
				Posição no Rank: **#${userMDB.xp.rankPos}**
				`
            )
            .addFields([
              {
                name: "\u200b",
                value: `
						**XP atual:** \`${userMDB.xp.xp}/${xpNecessario}\`
						**XP total:** \`${(userMDB.xp.level - 1) * 25 * userMDB.xp.level + userMDB.xp.xp}\`
						Ainda faltam **\`${xpFaltando}\`** de XP para atingir o nível **\`${userMDB.xp.level + 1}\`**
						`,
              },
            ]),
        ],
      });
    }

    if (interaction.options.getSubcommand() === "rank") {
      await interaction.deferReply({ ephemeral: true });

      const xpRanking = herc.xpRanking;
      var aMostrar = [];
      for (let i = 0; i < 10; i++) {
        try {
          var usa = await User.findOne({ _id: xpRanking[i][0] });
          var xpAcumulado = ((usa?.xp.level as number) - 1) * 25 * usa?.xp.level! + usa?.xp.xp!;
          var usaLevel = usa?.xp.level;
        } catch {
          (usa! as unknown as boolean) = false;
        }

        aMostrar.push(`#${i + 1} ${(usa! as unknown as boolean) == false ? "Não definido" : `${usa!.userTag}: < ${xpAcumulado!} | ${usaLevel} >`}`);
      }

      const embedRanking = new EmbedBuilder()
        .setColor("Blurple")
        .setAuthor({
          name: "Ranking de usuários por XP",
          iconURL: client.user?.avatarURL() as string,
        })
        .setDescription(`\`\`\`${aMostrar.join("\n")}\`\`\``)
        .setFooter({
          text: `Sua posição no rank: #${user.xp.rankPos}`,
          iconURL: interaction.user.avatarURL() as string,
        });

      await interaction.editReply({ embeds: [embedRanking] });
    }
  },
};
