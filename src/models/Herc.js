require('dotenv').config()
const { Schema, model } = require('mongoose');

const Herc = new Schema(
  {
    id: {
      type: String,
      default: process.env.CLIENT_ID,
      required: true
    },
    manutencao: {
        type: Boolean,
        default: false,
        required: true
    }
  }
);

module.exports = model('Herc', Herc);