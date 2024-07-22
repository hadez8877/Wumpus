import { Message, PermissionsBitField, ChannelType } from "discord.js";
import { describe, test, expect } from "vitest";
import WumpusClient from "./lib/WumpusClient";
import "dotenv/config";

const client = new WumpusClient();

describe("Bot Tests", () => {
    test("The bot should start its events", () => {
        client.eventHandler.loadAll();

        const events = client.eventHandler.modules;

        events.forEach(event => {
            expect(event.id).toBeDefined();
            expect(event.once).toBeDefined();

            expect(event.run).toBeInstanceOf(Function);
        });
    });

    test("The bot should start its commands", () => {
        client.commandHandler.loadAll();

        const commands = client.commandHandler.modules;

        commands.forEach(command => {
            expect(command.id).toBeDefined();
            expect(command.aliases).toBeInstanceOf(Array);
            expect(command.description).toBeDefined();
            expect(command.usage).toBeDefined();
            expect(command.permissionType).toMatch(/developer|owner|admin|mod|member/);
            expect(command.category).toBeDefined();
            expect(command.__filepath).toBeDefined();

            expect(command.run).toBeInstanceOf(Function);
        });
    });
});