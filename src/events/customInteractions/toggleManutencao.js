exports.execute = async function(interaction, herc) {
    herc.manutencao = herc.manutencao == true ? false : true
    await herc.save()
    await interaction.reply({ content: herc.manutencao == false ? 'Manutenção desativada!' : 'Manutenção ativada!', ephemeral: true })
}