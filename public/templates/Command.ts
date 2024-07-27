import { Client, Message } from "discord.js"
import Command from "../../src/lib/commands/Command"

class NameCommand extends Command {
    constructor() {
        super("name", {
            description: "command description",
            usage: "<important> [optional]"
        })
    }

    async run(message: Message, args: string[], client: Client) {
        // The logic of the command...
    }
};

export default NameCommand