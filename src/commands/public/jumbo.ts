import { Message } from "discord.js";
import Command from "../../lib/commands/Command";

class JumboCommand extends Command {
    constructor() {
        super("jumbo", {
            description: "Convierte un emoji en uno más grande.",
            usage: "<emoji>"
        });
    }

    async run(message: Message, args: string[]) {
        const emoji = args[0];
        const regex = /<a?:(\w+):(\d+)>/;

        const match = emoji.match(regex);

        if (match) {
            const emojiId = match[2];
            const isAnimated = emoji.startsWith("<a:");

            return await message.reply({ content: `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? "gif" : "png"}?v=1`, allowedMentions: { repliedUser: false } });
        } else {
            return await message.reply({ content: "<:UtilityMessageInteractionWarn:1234642336580108298> Por favor, proporciona un emoji válido.", allowedMentions: { repliedUser: false } });
        }
    }
};

export default JumboCommand;