import { ChatInputCommandInteraction, SlashCommandBuilder, TextChannel } from "discord.js";
import errorEmbedGenerate from "../responseMessages/errorEmbedGenerate";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("limpar")
    .setDescription("Limpa uma determinada quantidade de mensagens em um canal.")
    .addIntegerOption((option) => option.setName("mensagens-quantidade").setDescription("Quantidade de mensagens que deseja apagar.").setRequired(true).setMaxValue(100).setMinValue(2)),
  async executar(interaction: ChatInputCommandInteraction) {
    const messagesQ: number = interaction.options.getInteger("mensagens-quantidade") as number;

    try {
      await (interaction.channel as TextChannel).bulkDelete(messagesQ, true).then(async (messagesMap) => {
        let mapSize = messagesMap.size;
        if (mapSize <= 0)
          return interaction.reply({
            embeds: [errorEmbedGenerate("Não foi possível limpar nenhuma mensagem nesse canal!")],
            ephemeral: true,
          });

        await interaction.reply({
          embeds: [errorEmbedGenerate(`${interaction.user.username} limpou ${messagesQ} mensagens nesse canal!`)],
        });
        setTimeout(() => interaction.deleteReply(), 4000);
      });
    } catch (e) {
      console.error(e);
    }
  },
};
