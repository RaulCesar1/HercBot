import { client } from "..";
import Guild from "../models/Guild";

function load() {
  const guildIds = client.guilds.cache.map((guild) => guild.id);

  guildIds.forEach(async (guildId) => {
    const guildDB = await Guild.findOne({ _id: guildId });
    if (!guildDB) {
      await new Guild({ _id: guildId }).save();
      console.log(`Servidor criado na database: ${guildId}`);
    }
  });
}

export default function () {
  setInterval(load, 6000);
}
