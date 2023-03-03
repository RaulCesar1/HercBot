import { MessageComponentInteraction } from "discord.js";

export default async function (customId: string, interaction: MessageComponentInteraction) {
  const customInteraction = await import(`../customInteractions/${customId}`);
  customInteraction.default(interaction);
}
