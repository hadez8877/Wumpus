import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import { loadEvents } from "./handlers/eventHandler";
import { describe, test, expect, beforeAll, afterAll } from "vitest";

require("dotenv").config();

const { Guilds, GuildMembers, GuildMessages, MessageContent } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, MessageContent],
  partials: [User, Message, GuildMember, ThreadMember]
});

beforeAll(async () => {
  client.events = new Collection();
  client.prefixs = new Collection();

  const result = typeof await loadEvents(client);

  expect(typeof result).toBe("string");

  await new Promise((resolve, reject) => {
    client.once("ready", resolve);
    client.once("error", reject);

    client.login(process.env.TOKENTEST).catch(reject);
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