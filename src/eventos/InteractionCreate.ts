import { Events, CommandInteraction, BaseInteraction, MessageComponentInteraction } from "discord.js";

import { client } from "..";

import type IComando from "../customInterfaces/IComando";
import verifyCustomIds from "../functions/verifyCustomIds";
import verifyUser from "../functions/verifyUser";
import Herc from "../models/Herc";
import errorEmbedGenerate from "../responseMessages/errorEmbedGenerate";

module.exports = {
  nome: Events.InteractionCreate,
  once: false,
  async executar(interaction: BaseInteraction) {
    if (interaction.guildId == null) return;
    if (interaction.user.bot === true) return;

    const herc = (await Herc.findOne({ id: process.env.CLIENT_ID }))!;

    // Maintenance

    if (herc.manutencao == true && interaction.user.id !== "693929568020725843") return (interaction as CommandInteraction).reply({ embeds: [errorEmbedGenerate("A manutenção do bot está ativa, utilize esse comando novamente mais tarde!")], ephemeral: true });

    // Check if user exists in database

    verifyUser(interaction.user.id, interaction.user.username, interaction.user.tag, interaction as CommandInteraction);

    // Custom Interactions

    const interactionMessageComponent: MessageComponentInteraction = interaction as MessageComponentInteraction;

    if (interactionMessageComponent.customId) verifyCustomIds(interactionMessageComponent.customId, interactionMessageComponent);

    // Execute Commands

    if (!interaction.isChatInputCommand()) return;

    const interactionComando: CommandInteraction = interaction as CommandInteraction;

    const comando = client.comandos.get(interactionComando.commandName);
    if (!comando) return;

    try {
      await (comando as IComando).executar(interactionComando);
    } catch (error) {
      console.error(error);
      if (interactionComando.replied || interactionComando.deferred) {
        await interactionComando.followUp({
          content: "Ocorreu um erro ao executar esse comando!",
          ephemeral: true,
        });
      } else {
        await interactionComando.reply({
          content: "Ocorreu um erro ao executar esse comando!",
          ephemeral: true,
        });
      }
    }
  },
};
