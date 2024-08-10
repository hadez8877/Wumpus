import { Collection } from "discord.js";
import { readdirSync, statSync } from "fs";
import BaseHandler from "@/lib/BaseHandler";
import Command from "@/lib/commands/Command";
import kleur from "kleur";
import labelType from "@/utils/labels";
import logger from "@/utils/logger";
import path from "path";
import readline from "readline";
import src from "@/utils/src";
import WumpusBot from "@/lib/WumpusClient";

class CommandHandler extends BaseHandler {
  client: WumpusBot;
  modules: Collection<string, Command>;
  errorsFound: number;
  commandsLoaded: number;

  constructor(client: WumpusBot) {
    super(client, {
      path: src("data")
    });

    this.client = client;
    this.modules = new Collection();
    this.errorsFound = 0;
    this.commandsLoaded = 0;
  }

  async loadAll() {
    const commandFiles = this.getAllFiles(this.path).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    this.commandsStatus();

    for (const file of commandFiles) {
      try {
        const commandModule = await import(file);
        const command: Command = new commandModule.default();

        this.modules.set(command.id, command);

        this.commandsLoaded++;
      } catch (err) {
        this.errorsFound++;

        return logger.error(`\nError loading command from file ${kleur.bold().blue(`${file}`)}:\n`, err);
      }

      this.commandsStatus();
    }

    readline.cursorTo(process.stdout as any, 0);
    readline.clearLine(process.stdout as any, 0);

    process.stdout.write(`${labelType.SUCCESS} ${kleur.green("Commands loaded!\n")}`);
  }

  private getAllFiles(dir: string, files: string[] = []): string[] {
    const entries = readdirSync(dir);

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);

      if (statSync(fullPath).isDirectory()) {
        if (entry === "commands") {
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

  private commandsStatus() {
    readline.cursorTo(process.stdout as any, 0);
    readline.clearLine(process.stdout as any, 0);

    process.stdout.write(
      `${kleur.bold().blue(`${this.commandsLoaded} commands`)} and ${kleur.bold().red(`${this.errorsFound} errors`)} have been found.`
    );
  }
}

export default CommandHandler;
