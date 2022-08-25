const { Schema, model } = require('mongoose');

const Guild = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    tokenCategory: String
  }
);

module.exports = model('Guild', Guild);