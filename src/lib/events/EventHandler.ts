import { Collection } from "discord.js";
import Event from "@/lib/events/Event";
import BaseHandler from "@/lib/BaseHandler";
import WumpusBot from "@/lib/WumpusClient";
import { readdirSync, statSync } from "fs";
import path from "path";
import kleur from "kleur";
import readline from "readline";
import src from "@/utils/src";
import labelType from "@/utils/labels";

class EventHandler extends BaseHandler {
  client: WumpusBot;
  modules: Collection<string, Event>;
  private errorsFound: number;
  private eventsLoaded: number;

  constructor(client: WumpusBot) {
    super(client, {
      path: src("events"),
    });

    this.client = client;
    this.modules = new Collection();
    this.errorsFound = 0;
    this.eventsLoaded = 0;
  }

  async loadAll() {
    const eventFiles = this.getAllFiles(this.path).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of eventFiles) {
      try {
        const eventModule = await import(file);
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

        console.error(`\n${labelType.ERROR} Error loading event from file ${kleur.bold().blue(`${file}`)}:\n`, err);
      }

      this.updateEventsStatus();
    }

    readline.cursorTo(process.stdout as any, 0);
    readline.clearLine(process.stdout as any, 0);

    process.stdout.write(`${labelType.SUCCESS} ${kleur.green("Events loaded!\n")}`);
  }

  private getAllFiles(dir: string, files: string[] = []): string[] {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        this.getAllFiles(fullPath, files);
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  private updateEventsStatus() {
    readline.cursorTo(process.stdout as any, 0);
    readline.clearLine(process.stdout as any, 0);

    process.stdout.write(`${kleur.bold().blue(`${this.eventsLoaded} events`)} and ${kleur.bold().red(`${this.errorsFound} errors`)} have been found.`);
  }
}

export default EventHandler;
