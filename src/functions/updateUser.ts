import Herc from "../models/Herc";
import User from "../models/User";
import verificarTrabalho from "./verificarTrabalho";

export default async function (userID: string, userUsername: string, userTag: string) {
  const herc = (await Herc.findOne({ id: process.env.CLIENT_ID }))!;
  const user = (await User.findOne({ _id: userID }))!;

  const rankIndex = herc.xpRanking.findIndex((usa) => usa[0] == user._id);
  const rankPos = rankIndex + 1;

  const trabalhando = await verificarTrabalho(user._id);

  user.username = userUsername;
  user.userTag = userTag;
  user.xp.rankPos = rankPos;
  user.economia.trabalhando = trabalhando;

  await user.save();
}
