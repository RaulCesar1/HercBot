import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojiar")
    .setDescription("Transforme sua mensagem em emojis.")
    .addStringOption((option) => option.setName("mensagem").setDescription("Mensagem que será transformada em emojis.").setRequired(true).setMaxLength(500)),
  async executar(interaction: ChatInputCommandInteraction) {
    const mensagem = interaction.options.getString("mensagem") as string;

    await interaction.deferReply();

    const isLetter = (p: string) => p.toLowerCase() != p.toUpperCase();

    const nums: string[] = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:"];

    let novaString: string = "";

    for (let i = 0; i < mensagem.length; i++) {
      const char = mensagem.charAt(i);

      let toPush: string;

      switch (char) {
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          toPush = nums[Number(char)];
          break;
        case " ":
          toPush = char;
          break;
        case "!":
          toPush = ":exclamation:";
          break;
        case "?":
          toPush = ":question:";
          break;
        case "=":
          toPush = ":heavy_equals_sign:";
          break;
        case "+":
          toPush = ":heavy_plus_sign:";
          break;
        case "$":
          toPush = ":heavy_dollar_sign:";
          break;
        case "ç":
          toPush = "ç";
          break;
        default:
          toPush = char;
          if (isLetter(char) == true) toPush = `:regional_indicator_${char.toLowerCase()}:`;
          break;
      }

      novaString += toPush;
    }

    interaction.editReply(novaString);
  },
};
