import { CommandInteraction } from "discord.js";
import User from "../models/User";
import successEmbedGenerate from "../responseMessages/successEmbedGenerate";

export default async function (userID: string, userUsername: string, userTag: string, interacao?: CommandInteraction) {
  new User({
    _id: userID,
    username: userUsername,
    userTag,
  }).save();

  if (interacao)
    await interacao.reply({
      ephemeral: true,
      embeds: [successEmbedGenerate("Você acaba de ser registrado no banco de dados. Insira o comando novamente.")],
    });

  return console.log(`${userID} -> usuário registrado na database.`);
}
