const User = require('../models/User.js')
const Herc = require('../models/Herc.js')

async function updateRanking() {
    User.find({}, async (err, users) => {
        if(err) console.log(err)

        var usuarios = new Map()
        users.map(async user => { usuarios.set(`${user._id}`, ((((user.xp.level-1)*25)*user.xp.level)+user.xp.xp) )})

        usuarios = new Map([...usuarios.entries()].sort((a,b)  => b[1] - a[1]))

        const herc = await Herc.findOne({ id: process.env.CLIENT_ID })
        herc.xpRanking = [...usuarios]
        await herc.save()

        //.findIndex(user => user[0] == "id")
    })
}

exports.updateRanking = updateRanking