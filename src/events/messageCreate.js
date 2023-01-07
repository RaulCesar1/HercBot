require('dotenv').config()
const User = require('../models/User.js');
const { loadUser } = require('../utils/loadUser.js');
const { updateUser } = require('../utils/updateUser.js');
const Herc = require('../models/Herc.js')

module.exports = {
	async execute(message, client) {
        if(message.author.bot == true) return;

        const herc = await Herc.findOne({ id: process.env.CLIENT_ID })
        if(herc.manutencao == true) return

        // Update user (DB)

        const user = await User.findOne({ _id: message.author.id })
        if(!user) return loadUser(message.author.id, message, false, 1)
        await updateUser(user, 1, message, herc)

        // Gerar XP

        async function gerarXP() {
            const random = Math.floor(Math.random() * 4)
            random==1?user.xp.xp+=1:''
            if(user.xp.xp>=(50*user.xp.level)) {
                user.xp.xp-=(50*user.xp.level)
                user.xp.level+=1
            }
            await user.save()
        }
        gerarXP()
	},
};