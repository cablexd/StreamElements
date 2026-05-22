import { LiveChat } from 'youtube-chat'

const liveChat = new LiveChat({ liveId: process.env.YOUTUBE_STREAM_ID })

console.info(`Connecting to youtube chat of stream ${process.env.YOUTUBE_STREAM_ID}...`)
liveChat.start().then((success) => {
    if (success) {
        console.info(`Connected to youtube chat of stream ${process.env.YOUTUBE_STREAM_ID}`)
    } else {
        console.error('Failed to connect to youtube chat: stream may not be live')
    }
}).catch(err => console.error('Failed to connect to youtube chat:', err))

function isWithinLastMinutes(date, minutes) {
    const timestampTime = date.getTime()
    const currentTime = Date.now()
    return (currentTime - timestampTime) >= 0 && (currentTime - timestampTime) <= minutes * 60 * 1000
}

export function onMessageSent(consumer) {
    liveChat.on('chat', chatItem => {
        if (isWithinLastMinutes(chatItem.timestamp, 2)) {
            const username = chatItem.author.name
            const message = chatItem.message.map(part => part.text ?? part.emojiText ?? '').join('')
            consumer(username, message)
        }
    })
}