![MM Discord Bot](mm-discord-bot.png)

# MM Discord Bot

A Discord bot that automatically updates a Discord category name with the total count of trainers from a Neon database.

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Copy `example.env` to `.env` and fill in your configuration values
4. Run the bot with `npm start`

## Running

```bash
npm install
npm start
```

## Configuration

Create a `.env` file based on `example.env` with the following variables:

- `DISCORD_TOKEN`: Your Discord bot token
- `DATABASE_URL`: Your Neon database connection URL
- `GUILD_ID`: The ID of your Discord server
- `CATEGORY_ID`: The ID of the category channel to update

## Open Source

This bot is open source and will expand with additional features in the future.