import { Events, Message } from "discord.js";

import generateXP from "../functions/generateXP";
import verifyUser from "../functions/verifyUser";
import Herc from "../models/Herc";

module.exports = {
  nome: Events.MessageCreate,
  once: false,
  async executar(message: Message) {
    if (message.author.bot == true) return;

    const herc = (await Herc.findOne({ id: process.env.CLIENT_ID }))!;
    if (herc.manutencao == true) return;

    // Check if user exists in database

    verifyUser(message.author.id, message.author.username, message.author.tag);

    // Generate XP

    generateXP(message);
  },
};
