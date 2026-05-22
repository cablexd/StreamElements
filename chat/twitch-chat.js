import tmi from 'tmi.js'

const client = new tmi.Client({
    options: { debug: false },
    connection: {
        secure: true,
        reconnect: true
    },
    channels: [process.env.TWITCH_CHANNEL_NAME]
})

console.info(`Connecting to twitch chat of channel ${process.env.TWITCH_CHANNEL_NAME}...`)
client.connect()
    .then(() => console.info(`Connected to twitch chat of channel ${process.env.TWITCH_CHANNEL_NAME}`))
    .catch(err => console.error('Failed to connect to twitch chat:', err))

export function onMessageSent(consumer) {
    client.on('message', (channel, tags, message, self) => {
        if (self) return // ignore messages sent by this script itself

        const username = tags['display-name'] ?? tags.username
        const { color } = tags

        consumer(username, message, color)
    })
}