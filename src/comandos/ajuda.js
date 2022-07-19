require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ajuda')
		.setDescription('Mostra a descrição de um comando em específico')
		.addStringOption(option => option.setName('comando').setDescription('Comando que deseja ver a descrição').setRequired(false)),
	async execute(interaction, client) {
        let lista_comandos = []

        let comandos = fs.readdirSync('./src/comandos').filter((file) => file.endsWith('.js'));
        for(let comando of comandos) { lista_comandos.push(comando.replace('.js', ' ')) }

		let embed_ajuda_geral = new EmbedBuilder()
		.setColor('Aqua')
		.setDescription(`**Para ver a descrição de um comando específico, use o comando:**\n\`/ajuda <nome-do-comando>\``)
		.addFields([
			{name: 'Lista de comandos do bot:', value: lista_comandos.join('\n')}
		])

		if(!interaction.options.get('comando')) return interaction.reply({ embeds: [embed_ajuda_geral], ephemeral: true })
		if(
        !client.commands.get(interaction.options.get('comando').value) || 
        client.commands.get(interaction.options.get('comando').value) === undefined
        ) return interaction.reply({ content: `O comando \`${interaction.options.get('comando').value}\` não existe!`, ephemeral: true })

		let embed_ajuda_comando = new EmbedBuilder()
		.setColor('Aqua')
		.setDescription(`**${client.commands.get(interaction.options.get('comando').value).data.description}**`)

		interaction.reply({
			embeds: [embed_ajuda_comando],
			ephemeral: true,
		});
	},
};