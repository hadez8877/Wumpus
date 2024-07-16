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

    this.once('ready', () => {
      console.log("Bot is ready!");
    });

    if (!this.user) return;

    this.user.setPresence({
      activities: [
        {
          name: "I dont work! (really).",
          type: ActivityType.Custom
        }
      ]
    });
  }

  async start() {
    try {
      this.commandHandler.loadAll();
      await this.login(process.env.TOKEN);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

export default WumpusClient;