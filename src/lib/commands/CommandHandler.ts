import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import Command from './Command';
import src from '../../utils/src';
import BaseHandler from '../BaseHandler';
import WumpusBot from '../WumpusClient';

class CommandHandler extends BaseHandler {
  client: WumpusBot;
  modules: Collection<string, Command>;

  constructor(client: WumpusBot) {
    super(client, {
      path: src('commands')  // Actualiza la ruta aquí
    });
    this.client = client;
    this.modules = new Collection();
  }

  async loadAll() {
    const commandFiles = readdirSync(this.path).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
      const commandModule = await import(`${this.path}/${file}`);
      const command: Command = new commandModule.default();
      this.modules.set(command.id, command);
    }
  }
}

export default CommandHandler;