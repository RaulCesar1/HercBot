import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface IComando {
  data: SlashCommandBuilder;
  executar: (interaction: CommandInteraction) => Promise<void>;
}
