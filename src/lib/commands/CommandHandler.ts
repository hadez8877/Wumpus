import { Collection } from "discord.js";
import { readdirSync, statSync } from "fs";
import path from "path";
import readline from "readline";
import kleur from "kleur";
import logger from "../../logger";
import Command from "./Command";
import WumpusBot from "../WumpusClient";
import src from "../../utils/src";
import labelType from "../../utils/labels";

class CommandHandler {
  client: WumpusBot;
  modules: Collection<string, Command>;
  errorsFound: number;
  commandsLoaded: number;
  path: string;

  constructor(client: WumpusBot) {
    this.client = client;
    this.modules = new Collection();
    this.errorsFound = 0;
    this.commandsLoaded = 0;
    this.path = src("data");
  }

  async loadAll() {
    const commandFiles = this.getAllFiles(this.path);

    this.commandsStatus();

    for (const file of commandFiles) {
      if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;

      try {
        const commandModule = await import(file);
        const command: Command = new commandModule.default();
        this.modules.set(command.id, command);
        this.commandsLoaded++;
      } catch (err) {
        this.errorsFound++;
        logger.error(`Error loading command from file ${kleur.bold().blue(file)}:\n`, err);
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
