import { Collection } from "discord.js";
import EventEmitter from "events";
import { readdirSync, statSync } from "fs";
import path from "path";
import BaseModule from "@/lib/BaseModule";
import WumpusBot from "@/lib/WumpusClient";

export interface BaseHandlerData {
  path: string;
}

class BaseHandler extends EventEmitter {
  client: WumpusBot;
  modules: Collection<string, BaseModule>;
  path: string;

  constructor(client: WumpusBot, { path }: BaseHandlerData) {
    super();
    this.client = client;
    this.path = path;
    this.modules = new Collection();
  }

  register(mod: BaseModule, filepath: string) {
    mod.filepath = filepath;
    this.modules.set(mod.id, mod);

    if (mod.categoryID !== "default") return;
    const dirs = path.dirname(filepath).split(path.sep);
    mod.categoryID = dirs[dirs.length - 1];
  }

  deregister(mod: BaseModule) {
    if (mod.filepath) delete require.cache[require.resolve(mod.filepath)];
    this.modules.delete(mod.id);
  }

  load(filepath: string, isReload: boolean = false) {
    console.log("path", filepath);
    let mod = require(filepath);
    mod = new mod();

    this.register(mod, filepath);
    return mod;
  }

  reload(id: string | BaseModule) {
    const mod = this.modules.get(id.toString());
    if (!mod) return;

    this.deregister(mod);

    const filepath = mod.filepath;
    const newMod = this.load(filepath, true);
    return newMod;
  }

  remove(id: string | BaseModule) {
    const mod = this.modules.get(id.toString());
    if (!mod) return;
    this.deregister(mod);
    return mod;
  }

  loadAll() {
    const filepaths = BaseHandler.readdirRecursive(this.path);
    for (let filepath of filepaths) {
      filepath = path.resolve(filepath);
      this.load(filepath);
    }
  }

  static readdirRecursive(directory: string): string[] {
    const result: string[] = [];
    const files = readdirSync(directory);
    for (const file of files) {
      const filepath = path.join(directory, file);
      if (statSync(filepath).isDirectory()) this.readdirRecursive(filepath);
      else result.push(filepath);
    }
    return result;
  }
}

export default BaseHandler;
