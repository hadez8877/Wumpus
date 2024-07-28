import { ChannelType, Message, PermissionsBitField } from "discord.js"
import WumpusClient from "./lib/WumpusClient"

import whitelist from "./modals/whitelistSchema"

const client = new WumpusClient()

client.commandHandler.loadAll()
client.eventHandler.loadAll()

client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return

    // eslint-disable-next-line no-var
    var whitelistData = await whitelist.findOne({ Guild: message.guild?.id })
    if (!whitelistData) return

    const prefix = "s!"

    if (message.channel.type === ChannelType.GuildText) {
        if (client.user && !message.channel.permissionsFor(client.user)?.has(PermissionsBitField.Flags.SendMessages)) return
    }

    if (!message.content.startsWith(prefix)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g)

    const commandName = args.shift()?.toLowerCase()
    const command = client.commandHandler.modules.find((m: { aliases: string | string[]; }) => m.aliases.includes(`${commandName}`))

    if (!command) return

    const { permissionType } = command

    switch (permissionType) {
        case "developer":
            const developers: string[] = [
                "1173072980000112671"
            ]

            if (!developers.includes(message.author.id)) return await message.reply({ content: "<:BadgeSlashCommands:1234642175116054608> Este comando solo puede ser utilizado por el creador de Wumpus.", allowedMentions: { repliedUser: false } })
        break

        case "owner":
            if (message.guild && message.guild?.ownerId !== message.author.id) return
        break

        case "admin":
            if (!message.member?.permissions.has(PermissionsBitField.Flags.Administrator)) return await message.reply({ content: "<:UtilityMessageInteractionWarn:1234642336580108298> No tienes los permisos suficientes para usar este comando.", allowedMentions: { repliedUser: false } })
        break

        case "mod":
            // Coming soon!
        break
    }

    command.run(message, args, client)
})

client.login(process.env.TOKEN)