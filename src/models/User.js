const { Schema, model } = require('mongoose');
const { randomUUID } = require('crypto')

const User = new Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    userTag: { type: String, required: true },
    emQuestao: { type: Boolean, required: true, default: false },
    economia: {
      banco: {
          saldo: { type: Number, required: true, default: 0 },
          id: { type: String, required: true, default: randomUUID() }
      },
      carteira: {
          saldo: { type: Number, required: true, default: 0 }
      },
      trabalhando: { type: Boolean, required: true, default: false }
    },
    xp: {
      xp: { type: Number, required: true, default: 1 },
      level: { type: Number, required: true, default: 1 },
      rankPos: { type: Number, required: true, default: 0 }
    },
    anotacoes: { type: [], default: [], required: true }
  }
);

module.exports = model('User', User);