import { Client, Message } from "discord.js"
import BaseModule from "../BaseModule"

type permissionsType = "developer" | "owner" | "admin" | "mod" | "member";

interface CommandData {
  aliases?: string[];
  description?: string;
  usage?: string;
  permissionType?: permissionsType;
  category?: string;
}

abstract class Command extends BaseModule {
  aliases: string[]
  description: string
  usage: string
  permissionType: permissionsType
  __filepath: string
  category: string

  constructor(id: string, { aliases, description, usage, permissionType, category }: CommandData) {
    super(id, { category })
    this.aliases = aliases || [id]
    this.description = description || ""
    this.usage = usage || ""
    this.permissionType = permissionType || "member"
    this.__filepath = ""
    this.category = category || ""
  }

  abstract run(message: Message, args: string[], client: Client): void;
}

export default Command