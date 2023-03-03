import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { client } from "..";
import Guild from "../models/Guild";

module.exports = {
  data: new SlashCommandBuilder().setName("configurar").setDescription("Mostra o painel de configuração do bot."),
  async executar(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const guild = await Guild.findOne({ _id: interaction.guildId });

    const categoriaCalls = interaction.guild?.channels.cache.get(guild?.callsCategoria!) || "Não definido.";
    const categoriaTiquetes = interaction.guild?.channels.cache.get(guild?.tokenCategory!) || "Não definido.";

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents([new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Categoria de Calls").setCustomId("categoria-calls-btn"), new ButtonBuilder().setStyle(ButtonStyle.Primary).setLabel("Categoria de Tíquetes").setCustomId("categoria-tiquetes-btn")]);

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setDescription(
            `
					\`[🗣️] Categoria de calls privadas:\` ${categoriaCalls}
					\`[💬] Categoria de tíquetes de suporte:\` ${categoriaTiquetes}
					`
          )
          .setFooter({ text: "Painel de configuração", iconURL: client.user?.avatarURL() as string }),
      ],
      components: [buttons],
    });
  },
};
