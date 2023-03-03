import { CommandInteraction } from "discord.js";
import User from "../models/User";
import loadUser from "./loadUser";
import updateUser from "./updateUser";

export default async function (userID: string, userUsername: string, userTag: string, interacao?: CommandInteraction) {
  const user = (await User.findOne({ _id: userID }))!;
  if (!user) return loadUser(userID, userUsername, userTag, interacao);
  await updateUser(userID, userUsername, userTag);
}
