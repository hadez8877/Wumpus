import { Collection } from 'discord.js';
import Event from './Event'; 
import BaseHandler from '../BaseHandler';
import WumpusBot from '../WumpusClient';
import { readdirSync } from 'fs';
import kleur from 'kleur';
import readline from 'readline';
import src from '../../utils/src';
import labelType from '../../utils/labels';

class EventHandler extends BaseHandler {
  client: WumpusBot;
  modules: Collection<string, Event>;
  private errorsFound: number;
  private eventsLoaded: number;

  constructor(client: WumpusBot) {
    super(client, {
      path: src('events')
    });

    this.client = client;
    this.modules = new Collection();
    this.errorsFound = 0;
    this.eventsLoaded = 0;
  }

  async loadAll() {
    const eventFiles = readdirSync(this.path).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    this.eventsStatus();

    for (const file of eventFiles) {
      try {
        const eventModule = await import(`${this.path}/${file}`);
        const event: Event = new eventModule.default();

        if (event.once) {
          this.client.once(event.id, (...args) => event.run(...args));
        } else {
          this.client.on(event.id, (...args) => event.run(...args));
        }

        this.modules.set(event.id, event);

        this.eventsLoaded++;
      } catch (err) {
        this.errorsFound++;

        return console.error(`${labelType.ERROR} Error loading event from file ${kleur.bold().blue(`${file}`)}:\n`, err);
      }

      this.eventsStatus();
    }

    readline.cursorTo(process.stdout as any, 0);
    readline.clearLine(process.stdout as any, 0);

    process.stdout.write(`${labelType.SUCCESS} ${kleur.green("Events loaded!")}`);
  }

  private eventsStatus() {
    readline.cursorTo(process.stdout as any, 0);
    readline.clearLine(process.stdout as any, 0);

    process.stdout.write(`${kleur.bold().blue(`${this.eventsLoaded} events`)} and ${kleur.bold().red(`${this.errorsFound} errors`)} have been found.`);
  }
}

export default EventHandler;
