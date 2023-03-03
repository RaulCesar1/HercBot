import { REST, Routes } from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";

import { client } from "../index";

export default async function() {
  const comandos: any[] = [];
  const comandosDir = path.join(__dirname, "../comandos");

  const arquivosComandos = fs.readdirSync(comandosDir).filter((arquivo) => arquivo.endsWith(".js"));

  for (const arquivo of arquivosComandos) {
    const comando = await import(`../comandos/${arquivo}`);

    client.comandos.set(comando.data.name, comando);

    comandos.push(comando.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN as string);

  try {
    console.log(`Carregando ${comandos.length} comandos...`);

    const data: any = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), { body: comandos });

    console.log(`Foi carregado ${data.length} comandos com sucesso.`);
  } catch (e) {
    console.error(e);
  }
};
