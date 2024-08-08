import { describe, it, expect, beforeAll } from "vitest";
import WumpusClient from "@/lib/WumpusClient";

const client = new WumpusClient();

describe("Command Handler", () => {
  beforeAll(async () => {
    await client.commandHandler.loadAll();
  });

  it("should load all commands without errors", () => {
    const commands = client.commandHandler.modules;

    expect(commands.size).toBe(client.commandHandler.commandsLoaded);

    expect(client.commandHandler.errorsFound).toBe(0);
  });

  it("should verify command properties", () => {
    const commands = client.commandHandler.modules;

    commands.forEach((command) => {
      expect(command.id).toBeDefined();
      expect(command.aliases).toBeInstanceOf(Array);
      expect(command.description).toBeDefined();
      expect(command.usage).toBeDefined();
      expect(command.permissionType).toMatch(/developer|owner|admin|mod|member/);
      expect(command.category).toBeDefined();
    });
  });
});
