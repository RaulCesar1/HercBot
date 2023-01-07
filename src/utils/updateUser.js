// tipos:
// 1 = message
// 2 = interaction

const { verificarTrabalho } = require("./verificarTrabalho")

async function updateUser(user, tipo, int, herc) {
    const rankIndex = herc.xpRanking.findIndex(usa => usa[0] == user._id)
    const rankPos = rankIndex + 1

    var trabalhando = await verificarTrabalho(user._id)
    
    user.username = tipo==1?int.author.username:int.user.username
    user.userTag = tipo==1?int.author.tag:int.user.tag
    user.xp.rankPos = rankPos
    user.economia.trabalhando = trabalhando
    await user.save()
}

exports.updateUser = updateUser