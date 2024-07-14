/* eslint-disable no-undef */
import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import { loadEvents } from "./Handlers/eventHandler";
import { describe, test, expect } from "vitest";

require("dotenv").config();

const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember]
});

describe("Bot Tests", async () => {
  test("The bot must be started events", async () => {
    client.events = new Collection();
    client.commands = new Collection();
    client.prefixs = new Collection();

    const result = typeof await loadEvents(client);

    expect(typeof result).toBe("string");
  });

  test("The bot should be started", async () => {
    await new Promise((resolve) => {
      client.once("ready", resolve);
      client.login(process.env.TOKENTEST);
    });

    await client.login(process.env.TOKENTEST);

    expect(client.isReady()).toBe(true);
  });
});
