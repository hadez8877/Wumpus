const { Schema, model } = require("mongoose");

let prefixSchema = new Schema({
    Guild: String,
    Prefix: String,
});

module.exports = model("changePrefix", prefixSchema);