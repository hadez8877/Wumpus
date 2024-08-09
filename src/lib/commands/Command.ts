import { Client, Message } from "discord.js";
import BaseModule from "@/lib/BaseModule";
import APIPermissions from "@/types/permssions";

interface CommandData {
  aliases?: string[];
  description?: string;
  usage?: string;
  permissions?: APIPermissions[];
  category?: string;
}

abstract class Command extends BaseModule {
  aliases: string[];
  description: string;
  usage: string;
  permissions: APIPermissions[];
  __filepath: string;
  category: string;

  constructor(id: string, { aliases, description, usage, permissions, category }: CommandData) {
    super(id, { category });
    this.aliases = aliases || [id];
    this.description = description || "";
    this.usage = usage || "";
    this.permissions = permissions || [];
    this.__filepath = "";
    this.category = category || "";
  }

  abstract run(message: Message, args: string[], client: Client): void;
}

export default Command;
