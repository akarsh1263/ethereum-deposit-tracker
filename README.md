# Ethereum deposit tracker

This application monitors the ETH deposits on the Beacon Deposit Contract and records them onto a PostgreSQL database. Along with that, it also sends a Telegram notification when there is a deposit to this account using a Telegram bot

## Prerequisites

- Docker Desktop (for running on windows)
- Alchemy API Key (for interacting with Ethereum)
- Telegram Bot token and Chat ID for Telegram notifications

## Obtaining an Alchemy API Key

- Go to Alchemy's website.
- Sign up for an account or log in.
- Navigate to the Dashboard.
- Create a new app by selecting Create App.
- Choose the Ethereum network (e.g., Mainnet).
- Copy the API Key from the app details page.

## Obtaining a Telegram Bot Token and Chat ID

### Creating a Telegram Bot and Getting the Token

- Open Telegram and search for the BotFather.
- Start a chat with the BotFather and send the command /newbot.
- Follow the instructions to create a new bot. You will receive a Token that you need to use for your bot.

### Getting the Chat ID

- Start a chat with your bot by searching for its username and sending any message.
- Use the following URL to get updates for your bot:
  `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
- Look for the chat object in the response JSON. The id field within the chat object is your Chat ID.

## Environment Variables

Create a `.env` file in the root directory of the project with the following variables:

### .env

```env
# Web3 Provider URL
WEB3_WS_PROVIDER_URL=wss://mainnet.infura.io/ws/v3/YOUR_INFURA_PROJECT_ID

# PostgreSQL Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourPassword
POSTGRES_DB=eth_deposits
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Alchemy API Key
ALCHEMY_API_KEY=GrV1Sfqa6nOfzT9eqzsGR0qtt0-_CFVD

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

## Generating Docker image and running docker container

- Open Docker Desktop (to run on Windows)
- Run the command: `docker-compose up --build`

