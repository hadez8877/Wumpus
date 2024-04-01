const { Schema, model } = require("mongoose");

let reminder = new Schema({
    User: String,
    Time: String,
    Number: Number,
});

module.exports = model("reminder", reminder);