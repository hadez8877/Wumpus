import { ActivityType, Client, GatewayIntentBits, Partials } from "discord.js";
import CommandHandler from "./commands/CommandHandler";
import "dotenv/config";

class WumpusClient extends Client {
  commandHandler: CommandHandler;

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
      partials: [Partials.User, Partials.Message, Partials.GuildMember, Partials.ThreadMember]
    });

    this.commandHandler = new CommandHandler(this);
    this.start();

    this.user?.setPresence({
      activities: [
        {
          name: "I dont work! (really).",
          type: ActivityType.Custom
        }
      ]
    });

    this.once('ready', () => {
      console.log("\n\n🥳 Bot is ready!");
    });
  }

  async start() {
    try {
      this.commandHandler.loadAll();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

export default WumpusClient;