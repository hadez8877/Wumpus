import { Collection } from 'discord.js';
import { readdirSync } from 'fs';
import Command from './Command';
import src from '../../utils/src';
import BaseHandler from '../BaseHandler';
import WumpusBot from '../WumpusClient';
import readline from 'readline';
import kleur from 'kleur';

class CommandHandler extends BaseHandler {
  client: WumpusBot;
  modules: Collection<string, Command>;
  private errorsFound: number;
  private commandsLoaded: number;

  constructor(client: WumpusBot) {
    super(client, {
      path: src('commands')
    });

    this.client = client;
    this.modules = new Collection();
    this.errorsFound = 0;
    this.commandsLoaded = 0;
  }

  async loadAll() {
    const commandFiles = readdirSync(this.path).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    this.commandsStatus();

    for (const file of commandFiles) {
      try {
        const commandModule = await import(`${this.path}/${file}`);
        const command: Command = new commandModule.default();

        this.modules.set(command.id, command);

        this.commandsLoaded++;
      } catch (err) {
        this.errorsFound++;

        console.error(`Error loading command from file ${kleur.bold().blue(`${file}`)}:`, err);
      }

      this.commandsStatus();
    }

    this.commandsStatus();
  }

  private commandsStatus() {
    readline.cursorTo(process.stdout as any, 0);
    readline.clearLine(process.stdout as any, 0);

    process.stdout.write(`${kleur.bold().blue(`${this.commandsLoaded} commands`)} and ${kleur.bold().red(`${this.errorsFound} errors`)} have been found.`);
  }
}

export default CommandHandler;