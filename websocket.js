import { onMessageSent as onTwitchMessage } from './chat/twitch-chat.js'
import { onMessageSent as onYoutubeMessage } from './chat/youtube-chat.js'

export function setupSocket(io) {
    onTwitchMessage((username, message, color) => {
        io.emit('message', { platform: 'twitch', username, message, color })
    })

    onYoutubeMessage((username, message) => {
        io.emit('message', { platform: 'youtube', username, message })
    })
}