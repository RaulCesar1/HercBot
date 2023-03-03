import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("economia")
    .setDescription("Comandos de economia do bot.")
    .addSubcommandGroup((sub) =>
      sub
        .setName("carteira")
        .setDescription("Economia -> carteira")
        .addSubcommand((sub) => sub.setName("ver").setDescription("Veja o dinheiro que está guardado em sua carteira."))
    )
    .addSubcommandGroup((sub) =>
      sub
        .setName("banco")
        .setDescription("Economia -> banco")
        .addSubcommand((sub) => sub.setName("ver").setDescription("Veja as informações sobre sua conta bancária."))
        .addSubcommand((sub) =>
          sub
            .setName("depositar")
            .setDescription("Deposite o dinheiro que está em sua carteira em sua conta do banco.")
            .addIntegerOption((option) => option.setName("valor").setDescription("O valor que será depositado.").setRequired(true).setMinValue(1))
        )
        .addSubcommand((sub) =>
          sub
            .setName("sacar")
            .setDescription("Saque o dinheiro que está em sua conta do banco.")
            .addIntegerOption((option) => option.setName("valor").setDescription("O valor que será sacado.").setRequired(true).setMinValue(1))
        )
    )
    .addSubcommandGroup((sub) =>
      sub
        .setName("cheque")
        .setDescription("Economia -> cheque")
        .addSubcommand((sub) =>
          sub
            .setName("criar")
            .setDescription("Cria um cheque com um valor definido.")
            .addIntegerOption((option) => option.setName("valor").setDescription("O valor do cheque que será criado.").setRequired(true).setMinValue(1))
        )
        .addSubcommand((sub) => sub.setName("listar").setDescription("Mostra os cheques que você já criou."))
        .addSubcommand((sub) =>
          sub
            .setName("usar")
            .setDescription("Utilize um cheque e receba o dinheiro em sua conta do banco.")
            .addStringOption((option) => option.setName("codigo").setDescription("Código do cheque que será utilizado.").setRequired(true).setMinLength(43).setMaxLength(43))
        )
    )
    .addSubcommandGroup((sub) =>
      sub
        .setName("trabalho")
        .setDescription("Economia -> trabalho")
        .addSubcommand((sub) =>
          sub
            .setName("trabalhar")
            .setDescription("Trabalhe para ganhar dinheiro.")
            .addIntegerOption((option) => option.setName("tempo").setDescription("Quantidade de horas que irá trabalhar. Deixe em branco para trabalhar por 30 minutos.").setMaxValue(8).setMinValue(1))
        )
        .addSubcommand((sub) => sub.setName("progresso").setDescription("Acompanhe seu progresso no trabalho."))
        .addSubcommand((sub) => sub.setName("cancelar").setDescription("Cancele o trabalho que está fazendo."))
    )
    .addSubcommandGroup((sub) =>
      sub
        .setName("bolsa-de-valores")
        .setDescription("Economia -> bolsa de valores")
        .addSubcommand((sub) => sub.setName("ver").setDescription("Veja a situação atual da bolsa de valores."))
    ),
  async executar(interaction: ChatInputCommandInteraction) {
    (await import(`./economia/${interaction.options.getSubcommandGroup()}/${interaction.options.getSubcommand()}`)).default(interaction);
  },
};
