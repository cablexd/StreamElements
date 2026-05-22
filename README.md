# Cable's Custom Stream Elements

## Getting Started

1. Run `npm install`
2. Create `.env` file and set variables (see below)
3. Run `npm run start`
4. The custom elements are now being served and be used in OBS with a **Browser** element

## `.env` File

Create a `.env` file in the root and include the following variables:

- `PORT` - Port of server - defaults to `3000`
- `TWITCH_CHANNEL_NAME` - Twitch channel username to get chat from
- `YOUTUBE_STREAM_ID` - YouTube stream ID to get chat from