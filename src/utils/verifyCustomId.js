const baseDir = `../events/customInteractions/`

exports.execute = async function(cid, interaction, user, guild, herc) {
    if(cid === "toggleManutencao")         require(baseDir + 'toggleManutencao.js')          .execute(interaction, user, guild, herc)
    if(cid === "ticket-create")            require(baseDir + 'ticket-create.js')             .execute(interaction, user, guild, herc)
    if(cid === "anotacao-create")          require(baseDir + 'anotacao.js')                   .create(interaction, user, guild, herc)
    if(cid === "anotacao-modificar")       require(baseDir + 'anotacao.js')                   .modify(interaction, user, guild, herc)
    if(cid === "categoria-calls.btn")      require(baseDir + 'configPanel.js')     .categoriaCallsBtn(interaction, user, guild, herc)
    if(cid === "categoria-calls.modal")    require(baseDir + 'configPanel.js')   .categoriaCallsModal(interaction, user, guild, herc)
    if(cid === "categoria-tiquetes.btn")   require(baseDir + 'configPanel.js')  .categoriaTiquetesBtn(interaction, user, guild, herc)
    if(cid === "categoria-tiquetes.modal") require(baseDir + 'configPanel.js').categoriaTiquetesModal(interaction, user, guild, herc)
}