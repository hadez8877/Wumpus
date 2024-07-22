import { Message } from "discord.js";
import Command from "../lib/commands/Command";

class PingCommand extends Command {
  constructor() {
    super("ping", {
      description: "Verifica el ping del bot.",
    });
  }

  async run(message: Message) {
    const ping: number = Date.now() - message.createdTimestamp;

    return await message.reply({ content: `🏓 ¡Pong! La latencia es de \`\`${ping}ms\`\`.`, allowedMentions: { repliedUser: false } });
  }
}

export default PingCommand;