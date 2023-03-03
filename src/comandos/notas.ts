import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { client } from "..";

const AID = process.env.AID as string;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notas")
    .setDescription("Mostra as notas de atualização do bot.")
    .addIntegerOption((option) => option.setName("id").setDescription(`O ID de uma nota de atualização anterior.`).setMinValue(1).setMaxValue(Number(AID))),
  async executar(interaction: ChatInputCommandInteraction) {
    const notas = await import("../utils/notas.json");

    const id: string | number = interaction.options.getInteger("id") || AID;

    const nota = notas.ids.find((n) => n.id == id);

    try {
      interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setAuthor({
              name: "Notas de Atualização",
              iconURL: client.user?.avatarURL() as string,
            })
            .setTitle(`Versão ${nota?.version} (${nota?.data})`)
            .setDescription(nota?.desc as string)
            .setFooter({ text: `${nota?.id}ª Nota de atualização.` }),
        ],
      });
    } catch (e) {
      console.error(e);
    }
  },
};
