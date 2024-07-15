const { Schema, model } = require("mongoose");

const whitelist = new Schema({
    Guild: String
});

module.exports = model("whitelistSchema", whitelist);