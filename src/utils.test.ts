import test from "ava";
import { Client, Invite } from "discord.js";
import {
  trimLines,
  trimEmptyLines,
  asSingleLine,
  trimEmptyStartEndLines,
  successMessage,
  errorMessage,
  getUrlsInString,
  getInviteCodesInString,
  resolveInvite
} from "@/utils";

const mockClient = {
  fetchInvite: async (code: string) => {
    if (code === "validCode") {
      return { code, guild: null } as Invite;
    }
    return null;
  }
} as unknown as Client;

test("trimLines(): trims and removes extra spaces", (t) => {
  const result = trimLines("  line1  \n   line2  \n\n   line3   ");
  t.is(result, "line1\nline2\nline3");
});

test("trimEmptyLines(): removes empty lines", (t) => {
  const result = trimEmptyLines("line1\n\nline2\n\nline3");
  t.is(result, "line1\nline2\nline3");
});

test("asSingleLine(): converts multiline string to a single line", (t) => {
  const result = asSingleLine("  line1  \n   line2  \n\n   line3   ");
  t.is(result, "line1 line2 line3");
});

test("trimEmptyStartEndLines(): trims empty lines from start and end", (t) => {
  const result = trimEmptyStartEndLines("\n\n  line1  \n   line2  \n\n   line3   \n\n");
  t.deepEqual(result, ["line1", "line2", "line3"]);
});

test("successMessage(): adds success emoji", (t) => {
  const result = successMessage("Operation successful");
  t.is(result, "<:MessageSuccess:1273483541585330216> Operation successful");
});

test("errorMessage(): adds error emoji", (t) => {
  const result = errorMessage("Operation failed");
  t.is(result, "<:MessageInteractionWarn:1234642336580108298> Operation failed");
});

test("getUrlsInString(): detects full links", (t) => {
  const urls = getUrlsInString("foo https://google.com/ bar");
  t.is(urls.length, 1);
  t.is(urls[0].hostname, "google.com");
});

test("getUrlsInString(): detects partial links", (t) => {
  const urls = getUrlsInString("foo google.com bar");
  t.is(urls.length, 1);
  t.is(urls[0].hostname, "google.com");
});

test("getUrlsInString(): detects subdomains", (t) => {
  const urls = getUrlsInString("foo photos.google.com bar");
  t.is(urls.length, 1);
  t.is(urls[0].hostname, "photos.google.com");
});

test("getInviteCodesInString(): extracts Discord invite codes", (t) => {
  const codes = getInviteCodesInString("https://discord.com/invite/testcode discord.gg/testcode");
  t.deepEqual(codes, ["testcode", "testcode"]);
});

test("resolveInvite(): resolves valid invite code", async (t) => {
  const invite = await resolveInvite(mockClient, "validCode");
  t.truthy(invite);
  t.is(invite?.code, "validCode");
});

test("resolveInvite(): returns null for invalid invite code", async (t) => {
  const invite = await resolveInvite(mockClient, "invalidCode");
  t.is(invite, null);
});
