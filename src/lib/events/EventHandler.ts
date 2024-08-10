import { Collection } from "discord.js";
import { readdirSync, statSync } from "fs";
import BaseHandler from "@/lib/BaseHandler";
import Event from "@/lib/events/Event";
import kleur from "kleur";
import labelType from "@/utils/labels";
import logger from "@/utils/logger";
import path from "path";
import readline from "readline";
import src from "@/utils/src";
import WumpusBot from "@/lib/WumpusClient";

class EventHandler extends BaseHandler {
  client: WumpusBot;
  modules: Collection<string, Event>;
  errorsFound: number;
  eventsLoaded: number;

  constructor(client: WumpusBot) {
    super(client, {
      path: src("data")
    });

    this.client = client;
    this.modules = new Collection();
    this.errorsFound = 0;
    this.eventsLoaded = 0;
  }

  async loadAll() {
    const eventFiles = this.getAllFiles(this.path).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

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

        return logger.error(`Error loading event from file ${kleur.bold().blue(`${file}`)}:\n`, err);
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
        if (entry === "events") {
          const eventFiles = readdirSync(fullPath);

          for (const file of eventFiles) {
            if (file.endsWith(".ts") || file.endsWith(".js")) {
              files.push(path.join(fullPath, file));
            }
          }
        }

        this.getAllFiles(fullPath, files);
      }
    }

    return files;
  }

  private updateEventsStatus() {
    readline.cursorTo(process.stdout as any, 0);
    readline.clearLine(process.stdout as any, 0);

    process.stdout.write(
      `${kleur.bold().blue(`${this.eventsLoaded} events`)} and ${kleur.bold().red(`${this.errorsFound} errors`)} have been found.`
    );
  }
}

export default EventHandler;
