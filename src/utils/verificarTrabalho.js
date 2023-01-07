const Herc = require('../models/Herc.js')

async function verificarTrabalho(userID) {
    const herc = await Herc.findOne({ id: process.env.CLIENT_ID })
    const trabalhoEmProgresso = herc.trabalhosAtivos.find(trabalho => trabalho.trabalhadorID == userID)
    return !trabalhoEmProgresso?false:true
}

exports.verificarTrabalho = verificarTrabalho