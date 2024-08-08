import { describe, it, expect, beforeAll } from "vitest";
import WumpusClient from "@/lib/WumpusClient";

const client = new WumpusClient();

describe("event Handler", () => {
  beforeAll(async () => {
    await client.eventHandler.loadAll();
  });

  it("should load all events without errors", () => {
    const events = client.eventHandler.modules;

    expect(events.size).toBe(client.eventHandler.eventsLoaded);

    expect(client.eventHandler.errorsFound).toBe(0);
  });

  it("should verify event properties", () => {
    const events = client.eventHandler.modules;

    events.forEach((event) => {
      expect(event.id).toBeDefined();
      expect(event.once).toBeDefined();
    });
  });
});
