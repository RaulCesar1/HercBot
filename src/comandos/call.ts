import { ChannelType, ChatInputCommandInteraction, SlashCommandBuilder, VoiceChannel } from "discord.js";
import ICall from "../customInterfaces/ICall";
import Guild from "../models/Guild";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("call")
    .setDescription('Cria "calls" privadas.')
    .addSubcommand((sub) =>
      sub
        .setName("criar")
        .setDescription('Cria sua "call privada".')
        .addIntegerOption((option) => option.setName("usuarios-limite").setDescription("Limite de usuários que poderão entrar na call.").setRequired(true).setMaxValue(99).setMinValue(2))
    )
    .addSubcommand((sub) => sub.setName("deletar").setDescription("Deleta a sua call."))
    .addSubcommand((sub) =>
      sub
        .setName("modificar")
        .setDescription("Modifica características da sua call privada.")
        .addIntegerOption((option) => option.setName("usuarios-limite").setDescription("Limite de usuários que poderão entrar na call.").setRequired(true).setMaxValue(99).setMinValue(2))
    ),
  async executar(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const guild = await Guild.findOne({ _id: interaction.guildId });

    const callsCategoria = guild?.callsCategoria;

    if (interaction.options.getSubcommand() === "modificar") {
      if (!guild?.calls.find((call) => call.authorID == interaction.user.id)) return interaction.editReply(`Você não possui nenhuma call neste servidor! Crie uma utilizando </call criar:1057616383459983430>.`);

      const usuariosLimite: number = interaction.options.getInteger("usuarios-limite") as number;

      const call = guild.calls.find((call) => call.authorID == interaction.user.id);
      const canal: VoiceChannel = interaction.guild!.channels.cache.get((call as ICall).channelID) as VoiceChannel;

      if (canal?.members.size > usuariosLimite) return interaction.editReply("O limite de usuários inserido é menor que a quantidade de usuários conectados na call.");

      try {
        await canal?.setUserLimit(usuariosLimite);
        await interaction.editReply(`O limite de usuários da sua call foi alterado para **${usuariosLimite} usuários**.`);
      } catch (e) {
        console.log(e);
      }
    }

    if (interaction.options.getSubcommand() === "deletar") {
      if (!guild?.calls.find((call) => call.authorID == interaction.user.id)) return interaction.editReply(`Você não possui nenhuma call neste servidor! Crie uma utilizando </call criar:1057616383459983430>.`);

      try {
        const call_old = guild.calls.find((call) => call.authorID == interaction.user.id);

        const index_call = guild.calls.findIndex((call) => call.authorID == interaction.user.id);

        const call_del = interaction.guild!.channels.cache.get((call_old as ICall).channelID);

        if (!call_del) {
          guild.calls.splice(index_call, 1);
          await guild.save();
          await interaction.editReply(`Parece que a sua call foi deletada manualmente, agora você já pode criar outra.`);
          return;
        }

        await call_del.delete();
        guild.calls.splice(index_call, 1);
        await guild.save();
        await interaction.editReply(`Sua call privada foi deletada com sucesso!`);
      } catch (e) {
        console.log(e);
      }
    }

    if (interaction.options.getSubcommand() === "criar") {
      if (!callsCategoria) return interaction.editReply(`Este servidor não possui uma categoria definida para a criação de calls privadas!`);

      if (guild.calls.find((call) => call.authorID == interaction.user.id)) return interaction.editReply(`Você já criou uma call privada neste servidor, delete ela com </call deletar:1057616383459983430> antes de criar outra!`);

      const usuariosLimite: number = interaction.options.getInteger("usuarios-limite") as number;

      try {
        const nomeCall = `Call de ${interaction.user.username}`;

        interaction.guild?.channels
          .create({
            name: nomeCall,
            parent: callsCategoria,
            type: ChannelType.GuildVoice,
            reason: `Call criada por ${interaction.user.tag} (${interaction.user.id})`,
          })
          .then(async (canal) => {
            await canal.setUserLimit(usuariosLimite);
            guild.calls.push({
              authorID: interaction.user.id,
              channelID: canal.id,
            });
            await guild.save();
            await interaction.editReply({
              content: `Sua call foi criada com sucesso!\n**Nome: \`${nomeCall}\`**\n**Limite de usuários: \`${usuariosLimite}\`**`,
            });
          });
      } catch (e) {
        console.log(e);
      }
    }
  },
};
