import { Client, Invite, InviteGuild, Guild, PartialChannelData, ChannelType } from "discord.js";
import SimpleCache from "@/SimpleCache";
import tlds from "tlds";

export const MS = 1;
export const SECONDS = 1000 * MS;
export const MINUTES = 60 * SECONDS;
export const HOURS = 60 * MINUTES;
export const DAYS = 24 * HOURS;
export const WEEKS = 7 * 24 * HOURS;

export const DEFAULT_PREFIX = "!";

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

export function successMessage(str: string, emoji = "<:MessageSuccess:1273483541585330216>") {
  return emoji ? `${emoji} ${str}` : str;
}

export function errorMessage(str: string, emoji = "<:MessageInteractionWarn:1234642336580108298>") {
  return emoji ? `${emoji} ${str}` : str;
}

export type GuildInvite = Invite & { guild: InviteGuild | Guild };
export type GroupDMInvite = Invite & {
  channel: PartialChannelData;
  type: typeof ChannelType.GroupDM;
};

const realLinkRegex = /https?:\/\/\S+/; // http://anything or https://anything
const plainLinkRegex = /((?!https?:\/\/)\S)+\.\S+/; // anything.anything, without http:// or https:// preceding it

// Both of the above, with precedence on the first one
const urlRegex = new RegExp(`(${realLinkRegex.source}|${plainLinkRegex.source})`, "g");
const protocolRegex = /^[a-z]+:\/\//;

interface MatchedURL extends URL {
  input: string;
}

export function getUrlsInString(str: string, onlyUnique = false): MatchedURL[] {
  let matches = [...(str.match(urlRegex) ?? [])];
  if (onlyUnique) {
    matches = unique(matches);
  }

  return matches.reduce<MatchedURL[]>((urls, match) => {
    const withProtocol = protocolRegex.test(match) ? match : `https://${match}`;

    let matchUrl: MatchedURL;
    try {
      matchUrl = new URL(withProtocol) as MatchedURL;
      matchUrl.input = match;
    } catch {
      return urls;
    }

    let hostname = matchUrl.hostname.toLowerCase();

    if (hostname.length > 3) {
      hostname = hostname.replace(/[^a-z]+$/, "");
    }

    const hostnameParts = hostname.split(".");
    const tld = hostnameParts[hostnameParts.length - 1];
    if (tlds.includes(tld)) {
      urls.push(matchUrl);
    }

    return urls;
  }, []);
}

// discord.com/invite/<code>
// discordapp.com/invite/<code>
// discord.gg/invite/<code>
// discord.gg/<code>
// discord.com/friend-invite/<code>
const quickInviteDetection =
  /discord(?:app)?\.com\/(?:friend-)?invite\/([a-z0-9-]+)|discord\.gg\/(?:\S+\/)?([a-z0-9-]+)/gi;

const isInviteHostRegex = /(?:^|\.)(?:discord.gg|discord.com|discordapp.com)$/i;
const longInvitePathRegex = /^\/(?:friend-)?invite\/([a-z0-9-]+)$/i;

export function getInviteCodesInString(str: string): string[] {
  const inviteCodes: string[] = [];

  // Clean up markdown
  str = str.replace(/[|*_~]/g, "");

  // Quick detection
  const quickDetectionMatch = str.matchAll(quickInviteDetection);
  if (quickDetectionMatch) {
    inviteCodes.push(...[...quickDetectionMatch].map((m) => m[1] || m[2]));
  }

  // Deep detection via URL parsing
  const linksInString = getUrlsInString(str, true);
  const potentialInviteLinks = linksInString.filter((url) => isInviteHostRegex.test(url.hostname));
  const withNormalizedPaths = potentialInviteLinks.map((url) => {
    url.pathname = url.pathname.replace(/\/{2,}/g, "/").replace(/\/+$/g, "");
    return url;
  });

  const codesFromInviteLinks = withNormalizedPaths
    .map((url) => {
      // discord.gg/[anything/]<code>
      if (url.hostname === "discord.gg") {
        const parts = url.pathname.split("/").filter(Boolean);
        return parts[parts.length - 1];
      }

      // discord.com/invite/<code>[/anything]
      // discordapp.com/invite/<code>[/anything]
      // discord.com/friend-invite/<code>[/anything]
      // discordapp.com/friend-invite/<code>[/anything]
      const longInviteMatch = url.pathname.match(longInvitePathRegex);
      if (longInviteMatch) {
        return longInviteMatch[1];
      }

      return null;
    })
    .filter(Boolean) as string[];

  inviteCodes.push(...codesFromInviteLinks);

  return unique(inviteCodes);
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

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
