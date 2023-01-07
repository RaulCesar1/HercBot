require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { consultarCep, rastrearEncomendas } = require('correios-brasil')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('correios')
		.setDescription('Comandos relacionados aos Correios do Brasil.')
        .addSubcommand(sub =>
            sub.setName('consultar-cep')
            .setDescription('Consulte as informações sobre algum CEP.')
            .addStringOption(option =>
                option.setName('cep')
                .setRequired(true)
                .setDescription('CEP que deseja consultar.')    
            )
        )
/*         .addSubcommand(sub =>
            sub.setName('rastrear-encomenda')
            .setDescription('Rastreie sua encomenda.')
            .addStringOption(option =>
                option.setName('codigo-rastreio')
                .setRequired(true)
                .setDescription('Código de rastreio da encomenda.')    
            )    
        ) */,
	async execute(interaction, client) {
        if(interaction.options._subcommand === "consultar-cep") {
            const cep = interaction.options.get('cep').value
            consultarCep(cep).then(res => {
                if(res.data.erro) return interaction.reply({ ephemeral: true, content: `Não foi possível consultar o cep \`${cep}\`, verifique se digitou corretamente.` })
                const nfpc = "Não foi possível consultar."
                interaction.reply({ ephemeral: true, embeds: [
                    new EmbedBuilder()
                    .setColor('Blurple')
                    .setAuthor({ name: `CEP: ${cep}`, iconURL: interaction.user.avatarURL() })
                    .setDescription(`
                    Logradouro: **${res.data.logradouro||nfpc}**
                    Complemento: **${res.data.complemento||nfpc}**
                    Bairro: **${res.data.bairro||nfpc}**
                    Localidade: **${res.data.localidade||nfpc}**
                    UF: **${res.data.uf||nfpc}**
                    IBGE: **${res.data.ibge||nfpc}**
                    GIA: **${res.data.gia||nfpc}**
                    DDD: **${res.data.ddd||nfpc}**
                    SIAFI: **${res.data.siafi||nfpc}**
                    `)
                ] })
            }).catch(e => {
                return interaction.reply({ ephemeral: true, content: `Não foi possível consultar o cep \`${cep}\`, verifique se digitou corretamente.` })
            })
        }

/*         if(interaction.options._subcommand === "rastrear-encomenda") {
            const codigoRastreio = [`${interaction.options.get('codigo-rastreio').value}`]
            rastrearEncomendas(codigoRastreio).then(res => {
                if(res[0].mensagem) return interaction.reply({ content: res[0].mensagem, ephemeral: true })
            }).catch(e => {
                return interaction.reply({ ephemeral: true, content: `Não foi possível rastrear o código \`${codigoRastreio}\`, verifique se digitou corretamente.` })
            })
        } */
    }
}