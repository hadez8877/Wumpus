import { Schema, model } from "mongoose"

const whitelist = new Schema({
    Guild: String
})

export default model("whitelistSchema", whitelist)
