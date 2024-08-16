import { Schema, model } from "mongoose";

const approvedGuild = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },

  authorizedUsers: {
    type: [String],
    default: []
  }
});

export default model("approvedGuildSchema", approvedGuild);
