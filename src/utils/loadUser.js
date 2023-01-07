const User = require('../models/User.js')

// tipos:
// 1 - message
// 2 - interaction

async function loadUser(userID, int, res, tipo) {
    new User(
        { 
            _id: userID,
            username: tipo==1?int.author.username:int.user.username,
            userTag: tipo==1?int.author.tag:int.user.tag,
        }
    ).save()
    res==true?await int.reply({ ephemeral: true, content: '**Você acaba de ser registrado no banco de dados. Insira o comando novamente.**' }):''
    return console.log(`${userID} usuário registrado na database.`)
}

exports.loadUser = loadUser