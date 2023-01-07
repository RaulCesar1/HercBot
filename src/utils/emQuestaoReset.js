const User = require('../models/User.js')

async function emQuestaoReset() {
    User.find({}, async (err, users) => {
        users.forEach(async user => {
            user.emQuestao = false
            user.save()
        })
    })
}

exports.emQuestaoReset = emQuestaoReset