import { Message } from "discord.js";
import User from "../models/User";

export default async function (message: Message) {
  const user = (await User.findOne({ _id: message.author.id }))!;
  const random = Math.floor(Math.random() * 4);

  random == 1 ? (user.xp.xp += 1) : "";
  if (user.xp.xp >= 50 * user.xp.level) {
    user.xp.xp -= 50 * user.xp.level;
    user.xp.level += 1;
  }

  await user.save();
}
