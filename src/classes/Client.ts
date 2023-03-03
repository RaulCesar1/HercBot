import { Client, Collection } from "discord.js";
import { connect, set } from "mongoose";

export default class Herc extends Client {
  comandos = new Collection();
  tempBase = new Collection();

  constructor() {
    super({ intents: 3276799 });
  }

  login(): Promise<string> {
    return super.login(process.env.BOT_TOKEN);
  }

  mongoConectar(): void {
    set("strictQuery", false);
    connect(process.env.MONGO_URI as string).then(() => console.log("Conectado à MongoDB"));
  }
}
