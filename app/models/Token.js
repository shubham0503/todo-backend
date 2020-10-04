const mongoose = require("mongoose");

const tokenSchema = mongoose.model(
  "Token",
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 43200
    }
  })
);

module.exports = tokenSchema;
