import { Events } from "discord.js";
import loadGuilds from "../functions/loadGuilds";
import oneTimeHerc from "../functions/oneTimeHerc";
import randomBotActivity from "../functions/randomBotActivity";
import updateRanking from "../functions/updateRanking";
import updateTrabalhos from "../functions/updateTrabalhos";
import { client as Client } from "../index";

module.exports = {
  nome: Events.ClientReady,
  once: true,
  async executar(client: typeof Client) {
    console.log(`Logado como ${client.user!.tag}`);

    oneTimeHerc();
    randomBotActivity();
    updateRanking();
    updateTrabalhos();
    loadGuilds();
  },
};
