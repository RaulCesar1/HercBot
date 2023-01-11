require('dotenv').config()
const { Schema, model } = require('mongoose');

const Herc = new Schema(
  {
    id: { type: String, default: process.env.CLIENT_ID, required: true },
    manutencao: { type: Boolean, default: false, required: true },
    bolsaValores: { type: Number, default: 100, required: true },
    xpRanking: { type: [], default: [], required: true },
    listaCheques: { type: [], default: [], required: true },
    trabalhosAtivos: { type: [], default: [], required: true }
  }
);

module.exports = model('Herc', Herc);