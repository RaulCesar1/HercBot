import { client } from "../index";
import * as fs from "node:fs";
import * as path from "node:path";

export default function() {
  const eventosDir = path.join(__dirname, "../eventos");
  const eventosArquivos = fs.readdirSync(eventosDir).filter((arquivo) => arquivo.endsWith(".js"));

  for (const arquivo of eventosArquivos) {
    const arquivoDir = path.join(eventosDir, arquivo);
    const evento = require(arquivoDir);

    if (evento.once) {
      client.once(evento.nome, (...args: any) => evento.executar(...args));
    } else {
      client.on(evento.nome, (...args: any) => evento.executar(...args));
    }
  }
};
