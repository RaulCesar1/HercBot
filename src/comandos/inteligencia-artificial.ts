import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import { client } from "..";
import errorEmbedGenerate from "../responseMessages/errorEmbedGenerate";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inteligencia-artificial")
    .setDescription("Comandos relacionados à inteligência artificial.")
    .addSubcommand((sub) =>
      sub
        .setName("texto")
        .setDescription("Pergunte ou peça algo para a I.A responder em forma de texto.")
        .addStringOption((option) => option.setName("input-texto").setDescription("Pergunta para a I.A responder.").setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName("imagem")
        .setDescription("Envie uma descrição de uma imagem para a I.A gerar.")
        .addStringOption((option) => option.setName("desc").setDescription("Descrição da imagem para a I.A gerar.").setRequired(true))
    ),
  async executar(interaction: ChatInputCommandInteraction) {
    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(config);

    if (interaction.options.getSubcommand() === "texto") {
      try {
        await interaction.deferReply({ ephemeral: true });

        const input = interaction.options.getString("input-texto");

        const resposta = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: input,
          temperature: 1,
          max_tokens: 2048,
        });

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blurple")
              .setDescription(`\`\`\`${resposta.data.choices[0].text}\`\`\``)
              .setAuthor({
                name: `${input}`,
                iconURL: client.user?.avatarURL() as string,
              })
              .setFooter({
                text: `${interaction.user.tag} (${interaction.user.id})`,
                iconURL: interaction.user.avatarURL() as string,
              }),
          ],
        });
      } catch (e) {
        return interaction.editReply({
          embeds: [errorEmbedGenerate("Não foi possível gerar um texto utilizando a I.A.")],
        });
      }
    }

    if (interaction.options.getSubcommand() === "imagem") {
      try {
        await interaction.deferReply({ ephemeral: true });
        const desc: string = interaction.options.getString("desc") as string;

        const imagemGerada = await openai.createImage({
          prompt: desc,
          n: 1,
          size: "1024x1024",
          response_format: "url",
        });

        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blurple")
              .setAuthor({
                name: `${desc}`,
                iconURL: client.user?.avatarURL() as string,
              })
              .setImage(imagemGerada.data.data[0].url as string)
              .setFooter({
                text: `${interaction.user.tag} (${interaction.user.id})`,
                iconURL: interaction.user.avatarURL() as string,
              }),
          ],
        });
      } catch (e) {
        return interaction.editReply({
          embeds: [errorEmbedGenerate("Não foi possível gerar essa imagem.")],
        });
      }
    }
  },
};
