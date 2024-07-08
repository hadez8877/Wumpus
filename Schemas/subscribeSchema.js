const { Schema, model } = require("mongoose");

let subscribe = new Schema({
    Guild: String,
    Language: String,
    Prefix: String,
    Notifications: Boolean
});

module.exports = model("subscribeSchema", subscribe);