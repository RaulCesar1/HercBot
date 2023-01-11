const { Schema, model } = require('mongoose');

const Guild = new Schema(
  {
    _id: { type: String, required: true },
    tokenCategory: String,
    callsCategoria: String,
    calls: [ { authorID: { type: String, required: true }, channelID: { type: String, required: true } } ]
  }
);

module.exports = model('Guild', Guild);