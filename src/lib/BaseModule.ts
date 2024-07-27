import BaseHandler from "./BaseHandler"
import WumpusClient from "./WumpusClient"

export interface BaseModuleData {
  category?: string,
  once?: boolean
}
class BaseModule {
  id!: string
  filepath!: string
  category!: string
  client!: WumpusClient
  handler!: BaseHandler
  categoryID: string
  constructor (id: string, {
    category = "default"
  }: BaseModuleData) {
    this.id = id
    this.categoryID = category
  }

  reload () {
    this.handler.reload(this.id)
  }

  remove () {
    this.handler.remove(this.id)
  }

  toString () { return this.id };
}

export default BaseModule