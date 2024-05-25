const fs = require('node:fs')
const path = require('node:path')

const express = require("express")
const app = express()

const db = require("enhanced.db-new")

const Canvas = require("canvas")

const { Client, Collection, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((a) => {
        return GatewayIntentBits[a]
    }),
});

const options = {
    clearOnStart: false,
    filename: "enhanced.sqlite",
};

db.options(options)

client.commands = new Collection()
const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath);

app.get('/', (req, res) => {
    const action = require(__dirname + '/base/web.js').request
    action(req, res, client)
});

Canvas.registerFont(`${__dirname}/assets/fonts/setofont.ttf`, { family: 'Seto' });

(function clientImport() {
    try {
        // Config
        client.config = require('./config.js')
        client.log = require('./base/log.js').log
        client.w2j = require('./base/webp2jpg.js').WebPToJPG
        client.b2h = require('./base/b10toHex.js').colorToHexString
        client.db = db
    } catch (e) {
        console.log(e)
        throw new Error('Failed to import client function!')
    }
})()

client.log('Starting...', 'info')

// Load commands
for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder)
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command)
        } else {
            client.log(
                `The command at ${filePath} is missing a required "data" or "execute" property.`,
                'warn'
            )
        }
    }
}

// Handle events
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file)
    const event = require(filePath)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

client.login(client.config.token)
app.listen(client.config.port, () => {
    client.log('Server is ready!', 'info')
})