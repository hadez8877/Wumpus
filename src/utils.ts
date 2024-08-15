import { Client, Invite } from "discord.js";
import SimpleCache from "@/SimpleCache";


export const MS = 1;
export const SECONDS = 1000 * MS;
export const MINUTES = 60 * SECONDS;
export const HOURS = 60 * MINUTES;
export const DAYS = 24 * HOURS;
export const WEEKS = 7 * 24 * HOURS;

export function trimLines(str: string) {
  return str
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .trim();
}

export function trimEmptyLines(str: string) {
  return str
    .split("\n")
    .filter((l) => l.trim() !== "")
    .join("\n");
}

export function asSingleLine(str: string) {
  return trimLines(str).replace(/\n/g, " ");
}

export function trimEmptyStartEndLines(str: string) {
  const lines = str.split("\n");
  let emptyLinesAtStart = 0;
  let emptyLinesAtEnd = 0;

  for (const line of lines) {
    if (line.match(/^\s*$/)) {
      emptyLinesAtStart++;
    } else {
      break;
    }
  }

  for (let i = lines.length - 1; i > 0; i--) {
    if (lines[i].match(/^\s*$/)) {
      emptyLinesAtEnd++;
    } else {
      break;
    }
  }
}

const inviteCache = new SimpleCache<Promise<Invite | null>>(10 * MINUTES, 200);

type ResolveInviteReturnType = Promise<Invite | null>;
export async function resolveInvite<T extends boolean>(
  client: Client,
  code: string,
  withCounts?: T
): ResolveInviteReturnType {
  const key = `${code}:${withCounts ? 1 : 0}`;

  if (inviteCache.has(key)) {
    return inviteCache.get(key) as ResolveInviteReturnType;
  }

  const promise = client.fetchInvite(code).catch(() => null);
  inviteCache.set(key, promise);

  return promise as ResolveInviteReturnType;
}

