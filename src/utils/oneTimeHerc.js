const Herc = require('../models/Herc.js');

async function oneTimeHerc() {
    const herc = await Herc.findOne({ id: process.env.CLIENT_ID })
    if(!herc) {
        new Herc().save()
        return console.log('Herc criado na database.')
    }
    await herc.save()
}

exports.oneTimeHerc = oneTimeHerc