import { Client, Message } from 'discord.js';
import BaseModule from '../BaseModule';

interface CommandData {
  aliases: string[];
  description?: string;
  usage?: string;
  onlyOwner?: boolean;
  category?: string;
}

abstract class Command extends BaseModule {
  aliases: string[];
  description: string;
  usage: string;
  onlyOwner: boolean;
  __filepath: string;
  category: string;

  constructor(id: string, { aliases, description, usage, onlyOwner, category }: CommandData) {
    super(id, { category });
    this.aliases = aliases;
    this.description = description || '';
    this.usage = usage || "";
    this.onlyOwner = onlyOwner || false;
    this.__filepath = '';
    this.category = category || '';
  }

  abstract run(message: Message, args: string[], client: Client): void;
}

export default Command;