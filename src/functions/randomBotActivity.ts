import { client } from "..";

function randomStatus() {
  const status: string[] = ["Bot criado por Luar#8567", 'Digite "/" e veja meus comandos!'];

  let raStatus = Math.floor(Math.random() * status.length);
  client.user?.setActivity(status[raStatus]);
}

export default function () {
  setInterval(randomStatus, 10000);
}
