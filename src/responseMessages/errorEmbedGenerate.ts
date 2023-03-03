import { EmbedBuilder, inlineCode } from "discord.js";

export default function (message: string): EmbedBuilder {
  return new EmbedBuilder().setColor("Red").setDescription(inlineCode(`[❌] ${message}`));
}
