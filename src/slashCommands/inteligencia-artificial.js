require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { Configuration, OpenAIApi } = require("openai")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('inteligencia-artificial')
		.setDescription('Comandos relacionados à inteligência artificial.')
        .addSubcommand(sub =>
            sub.setName('texto')
            .setDescription('Pergunte ou peça algo para a I.A responder em forma de texto.')
            .addStringOption(option =>
                option.setName('input-texto')
                .setDescription('Pergunta para a I.A responder.')
                .setRequired(true)
            )
        )
        .addSubcommand(sub =>
            sub.setName('imagem')
            .setDescription('Envie uma descrição de uma imagem para a I.A gerar.')   
            .addStringOption(option =>
                option.setName('desc')
                .setDescription('Descrição da imagem para a I.A gerar.')    
                .setRequired(true)
            ) 
        ),
	async execute(interaction, client) {
        const config = new Configuration({
            apiKey: process.env.OPENAI_API_KEY
        })
        const openai = new OpenAIApi(config)

        if(interaction.options._subcommand === 'texto') {
            try {
                await interaction.deferReply({ephemeral: true})
                const input = interaction.options.get('input-texto').value
    
                const resposta = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: input,
                    temperature: 1,
                    max_tokens: 2048
                })
    
                await interaction.editReply({ embeds: [
                    new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription(`\`\`\`${resposta.data.choices[0].text}\`\`\``)
                    .setAuthor({ name: `${input}`, iconURL: client.user.avatarURL() })
                    .setFooter({ text: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.avatarURL() })
                ] })
            } catch(e) {
                return interaction.editReply({ ephemeral: true, content: 'Não foi possível gerar um texto utilizando a I.A.' })
            }
        }

        if(interaction.options._subcommand === "imagem") {
            try {
                await interaction.deferReply({ephemeral: true})
                const desc = interaction.options.get('desc').value
    
                const imagemGerada = await openai.createImage({
                    prompt: desc,
                    n: 1,
                    size: '1024x1024',
                    response_format: 'url'
                })
    
                await interaction.editReply({ embeds: [
                    new EmbedBuilder()
                    .setColor("Blurple")
                    .setAuthor({ name: `${desc}`, iconURL: client.user.avatarURL() })
                    .setImage(imagemGerada.data.data[0].url)
                    .setFooter({ text: `${interaction.user.tag} (${interaction.user.id})`, iconURL: interaction.user.avatarURL() })
                ] })
            } catch(e) {
                return interaction.editReply({ ephemeral: true, content: 'Não foi possível gerar esta imagem.' })
            }
        }
    }
}