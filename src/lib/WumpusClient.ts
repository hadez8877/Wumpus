import { Client, GatewayIntentBits, Partials } from "discord.js";
import { stdin } from "process";
import CommandHandler from "@/lib/commands/CommandHandler";
import EventHandler from "@/lib/events/EventHandler";

import "dotenv/config";

class WumpusClient extends Client {
  commandHandler: CommandHandler;
  eventHandler: EventHandler;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ],
      partials: [Partials.User, Partials.Message, Partials.GuildMember, Partials.ThreadMember]
    });

    this.commandHandler = new CommandHandler(this);
    this.eventHandler = new EventHandler(this);

    this.once("ready", () => {
      this.readTerminal();
    });
  }

  readTerminal() {
    stdin.setEncoding("utf-8");
    stdin.setRawMode(true);

    stdin.on("data", (key: Buffer | string) => {
      switch (key) {
        case "s":
          this.destroy();

          process.exit(0);
          break;
      }
    });
  }
}

export default WumpusClient;
