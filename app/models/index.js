const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./User");
db.todo = require("./Todo");
db.token = require("./Token");

module.exports = db;