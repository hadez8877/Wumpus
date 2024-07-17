import { Message, PermissionsBitField, ChannelType } from "discord.js";
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import WumpusClient from "./lib/WumpusClient";
import "dotenv/config";

const client = new WumpusClient();

beforeAll(async () => {
    client.on('messageCreate', async (message: Message) => {
        if (message.author.bot) return;

        const prefix = "s!";

        if (message.channel.type === ChannelType.GuildText) {
            if (client.user && !message.channel.permissionsFor(client.user)?.has(PermissionsBitField.Flags.SendMessages)) return;
        }

        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        const commandName = args.shift()?.toLowerCase();
        const command = client.commandHandler.modules.find((m: { aliases: string | string[]; }) => m.aliases.includes(`${commandName}`));

        if (!command) return;

        try {
            command.run(message, args, client)
        } catch (error) {
            console.error(error)
        }
    });

    await new Promise(async (resolve, reject) => {
        client.once("ready", resolve);
        client.once("error", reject);

        await client.login(process.env.TOKENTEST).catch(reject);
    });
});

afterAll(async () => {
    await client.destroy();
});

describe("Bot Tests", () => {
    test("The bot should be started", () => {
        expect(client.isReady()).toBe(true);
    });
});