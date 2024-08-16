import { Schema, model } from "mongoose";
import { DEFAULT_PREFIX } from "@/utils";

const configureGuild = new Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  prefix: {
    type: String,
    default: DEFAULT_PREFIX
  },
  muterole: {
    type: String,
    required: true
  },

  modroles: {
    roles: [
      {
        roleId: {
          type: String,
          required: true
        }
      }
    ]
  },

  logs: {
    channels: [
      {
        channelId: {
          type: String,
          required: true
        },
        logs: [
          {
            type: String,
            required: true
          }
        ]
      }
    ]
  }
});

export default model("configureGuildSchema", configureGuild);
