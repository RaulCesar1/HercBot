require('dotenv').config()
const { commandos } = require('../commandHandler.js')
const Herc = require('../models/Herc.js')
const Guild = require('../models/Guild.js')
const User = require('../models/User.js')
const { loadUser } = require('../utils/loadUser.js')
const { updateUser } = require('../utils/updateUser.js')

module.exports = {
	async execute(interaction, client) {
        if (interaction.guildId == null) return
        if (interaction.user.bot === true) return

        const herc = await Herc.findOne({ id: process.env.CLIENT_ID })
        const guild = await Guild.findOne({ _id: interaction.guildId })

        // Manutenção

        if(herc.manutencao == true && interaction.user.id !== "693929568020725843")
        return interaction.reply({ content: "A manutenção do bot está ativa, utilize esse comando novamente mais tarde!", ephemeral: true })

        // Update user (DB)

        const user = await User.findOne({ _id: interaction.user.id })
        if(!user) return loadUser(interaction.user.id, interaction, true)
        await updateUser(user, 2, interaction, herc)

        // Custom interactions
        
        const cid = interaction.customId

        if(cid === "toggleManutencao") require('./customInteractions/toggleManutencao.js').execute(interaction, herc)
        if(cid === "ticket-create") require('./customInteractions/ticket-create.js').execute(interaction, guild)
        if(cid === "anotacao-create") require('./customInteractions/anotacao.js').create(interaction, user)
        if(cid === "anotacao-modificar") require('./customInteractions/anotacao.js').modify(interaction, user)
        if(cid === "categoria-calls.btn") require('./customInteractions/configPanel.js').categoriaCallsBtn(interaction, user, guild)
        if(cid === "categoria-calls.modal") require('./customInteractions/configPanel.js').categoriaCallsModal(interaction, user, guild)
        if(cid === "categoria-tiquetes.btn") require('./customInteractions/configPanel.js').categoriaTiquetesBtn(interaction, user, guild)
        if(cid === "categoria-tiquetes.modal") require('./customInteractions/configPanel.js').categoriaTiquetesModal(interaction, user, guild)

        // Executar comando

        let command = commandos.get(interaction.commandName)
        if (!command) return

        try {
            await command.execute(interaction, client, guild, herc, user)
        } catch (error) {
            console.error(error)
            await interaction.reply({
                content: 'Ocorreu um erro ao executar este comando!',
                ephemeral: true,
            })
        }
	},
};