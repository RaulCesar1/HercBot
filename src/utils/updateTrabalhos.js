const User = require('../models/User.js')
const Herc = require('../models/Herc.js')

async function updateTrabalhos() {
    const herc = await Herc.findOne({ id: process.env.CLIENT_ID })
    
    User.find({}, async (err, users) => {
        if(err) console.log(err)

        const usuariosTrabalhando = users.filter(user => user.economia.trabalhando == true)

        usuariosTrabalhando.forEach(async user => {
            const userDB = await User.findOne({ _id: user._id })

            const trabalho = herc.trabalhosAtivos.find(trabalho => trabalho.trabalhadorID == userDB._id)
            const trabalhoIndex = herc.trabalhosAtivos.findIndex(trabalho => trabalho.trabalhadorID == userDB._id)

            const tempoRestante = (trabalho.tempo*60) - (Math.floor((Date.now() - trabalho.comecou) / (1000*60)))

            if(tempoRestante <= 0) {
                userDB.economia.banco.saldo+=trabalho.ganhos
                userDB.economia.trabalhando=false
                herc.trabalhosAtivos.splice(trabalhoIndex, 1)
                await userDB.save()
                await herc.save()
                console.log(`${user.userTag} (${user._id}) trabalhou -> ${trabalho.tempo} $${trabalho.ganhos}`)
                return 
            } 
        })
    })
}

exports.updateTrabalhos = updateTrabalhos