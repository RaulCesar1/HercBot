import { ActionRowBuilder, ChatInputCommandInteraction, EmbedBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { client } from "..";

import IAnotacao from "../customInterfaces/IAnotacao";
import User from "../models/User";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anotacoes")
    .setDescription("Comando relacionado a anotações.")
    .addSubcommand((sub) => sub.setName("criar").setDescription("Crie suas anotações."))
    .addSubcommand((sub) => sub.setName("listar").setDescription("Mostra uma lista com suas anotações."))
    .addSubcommand((sub) =>
      sub
        .setName("selecionar")
        .setDescription("Selecione uma anotação sua pelo ID e veja mais detalhes sobre ela.")
        .addIntegerOption((option) => option.setName("anotacao-id").setDescription("ID da sua anotação.").setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName("deletar")
        .setDescription("Exclua uma anotação sua.")
        .addIntegerOption((option) => option.setName("anotacao-id").setDescription("ID da sua anotação.").setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName("modificar")
        .setDescription("Modifique uma anotação sua.")
        .addIntegerOption((option) => option.setName("anotacao-id").setDescription("ID da sua anotação.").setRequired(true))
    ),
  async executar(interaction: ChatInputCommandInteraction) {
    const user = await User.findOne({ _id: interaction.user.id });

    if (interaction.options.getSubcommand() === "deletar") {
      const anotacaoId = interaction.options.getInteger("anotacao-id");

      const anotacao = user?.anotacoes?.find((x) => x.id == anotacaoId);
      const anotacaoIndex = user?.anotacoes?.findIndex((x) => x.id == anotacaoId);

      if (!anotacao)
        return interaction.reply({
          ephemeral: true,
          content: "Não foi possível encontrar uma anotação sua com esse ID. Verifique se o ID que inseriu existe.",
        });

      try {
        user?.anotacoes?.splice(anotacaoIndex as number, 1);
        await user?.save();

        return interaction.reply({
          ephemeral: true,
          content: `Anotação \`${anotacaoId}\` foi excluída.`,
        });
      } catch (e) {
        console.error(e);
      }
    }

    if (interaction.options.getSubcommand() === "selecionar") {
      const anotacaoId = interaction.options.getInteger("anotacao-id");
      const anotacao = user?.anotacoes?.find((x) => x.id == anotacaoId);

      if (!anotacao)
        return interaction.reply({
          ephemeral: true,
          content: "Não foi possível encontrar uma anotação sua com esse ID. Verifique se o ID que inseriu existe.",
        });

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setAuthor({
              name: anotacao.titulo,
              iconURL: interaction.user.avatarURL() as string,
            })
            .setDescription(`\`\`\`${anotacao.texto}\`\`\``)
            .setFooter({
              text: `ID ${anotacao.id} | Alterada em: ${new Date(anotacao.alteradaEm).toLocaleString("pt-BR")}`,
            }),
        ],
      });
    }

    if (interaction.options.getSubcommand() === "modificar") {
      const anotacaoId = interaction.options.getInteger("anotacao-id");
      const anotacao = user?.anotacoes?.find((x) => x.id == anotacaoId);

      if (!anotacao)
        return interaction.reply({
          ephemeral: true,
          content: "Não foi possível encontrar uma anotação sua com esse ID. Verifique se o ID que inseriu existe.",
        });

      const Formulario = new ModalBuilder().setTitle("Anotação").setCustomId("anotacao-modificar");

      const Anotacao = new TextInputBuilder().setCustomId("__a").setLabel(`Escreva a nova anotação aqui`).setRequired(true).setStyle(TextInputStyle.Paragraph).setMinLength(1).setPlaceholder(anotacao.texto);

      const f1 = new ActionRowBuilder<TextInputBuilder>().addComponents(Anotacao);

      Formulario.addComponents(f1);

      client.tempBase.set(`${interaction.user.id}_tempAnotacaoModificar`, anotacao.id);

      return await interaction.showModal(Formulario);
    }

    if (interaction.options.getSubcommand() === "listar") {
      const anotacoesUsuarioIds = user?.anotacoes?.map((x: IAnotacao) => x.id);

      return interaction.reply({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor("Blurple")
            .setAuthor({
              name: "Suas anotações",
              iconURL: interaction.user.avatarURL() as string,
            })
            .setDescription(!anotacoesUsuarioIds || anotacoesUsuarioIds.length == 0 ? "Você não possui nenhuma anotação ainda." : anotacoesUsuarioIds.join("\n"))
            .setFooter({
              text: "Para ler alguma anotação utilize o comando /anotacoes selecionar <id>",
            }),
        ],
      });
    }

    if (interaction.options.getSubcommand() === "criar") {
      const Formulario = new ModalBuilder().setTitle("Anotação").setCustomId("anotacao-create");

      const Titulo = new TextInputBuilder().setCustomId("__a").setLabel("Dê um titulo para a sua anotação").setRequired(true).setStyle(TextInputStyle.Short).setMinLength(1).setMaxLength(30);

      const Anotacao = new TextInputBuilder().setCustomId("__b").setLabel(`Escreva sua anotação aqui`).setRequired(true).setStyle(TextInputStyle.Paragraph).setMinLength(1);

      const f1 = new ActionRowBuilder<TextInputBuilder>().addComponents(Anotacao);
      const f2 = new ActionRowBuilder<TextInputBuilder>().addComponents(Titulo);

      Formulario.addComponents(f1, f2);

      return await interaction.showModal(Formulario);
    }
  },
};
