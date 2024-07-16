import { Message, Client } from "discord.js";
import Command from "../lib/commands/Command";

class PingCommand extends Command {
  constructor() {
    super("ping", {
      aliases: ["ping"],
      description: "¡Verifica el ping del bot!",
    });
  }

  async run(message: Message) {
    const ping = message.client.ws.ping;

    return await message.reply({ content: `🏓 ¡Pong! La latencia es de \`\`${ping}ms\`\`.`, allowedMentions: { repliedUser: false } });
  }
}

export default PingCommand;