const { Schema, model } = require("mongoose");

const subscribe = new Schema({
    Guild: String,
    Language: String,
    Prefix: String,
    Notifications: Boolean
});

module.exports = model("subscribeSchema", subscribe);