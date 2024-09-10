const { saveDepositToDB } = require('./db');
const { Network, Alchemy } = require('alchemy-sdk');

const fetch = require('node-fetch');

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const sendTelegramNotification = async (message) => {
  try {
    await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('Notification sent:', message);
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
};




// Initialize Alchemy SDK
const settings = {
  apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key
  network: Network.ETH_MAINNET, // You can replace this with the appropriate network
};
const alchemy = new Alchemy(settings);

const depositContractAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';

// Function to track deposits and process logs
const trackDeposits = async () => {
  console.log('Listening for new blocks...');

  // Subscribe to new blocks using Alchemy SDK
  alchemy.ws.on('block', async (blockNumber) => {
    console.log(`New block received: ${blockNumber}`);

    try {
      // Fetch block details
      const block = await alchemy.core.getBlock(blockNumber);

      // Fetch all logs for the Beacon Deposit Contract in this block
      const logs = await alchemy.core.getLogs({
        address: depositContractAddress,
        fromBlock: blockNumber,
        toBlock: blockNumber
      });

      if (logs.length > 0) {
        logs.forEach(async (log) => {
          const { blockNumber, transactionHash } = log;

          console.log('New deposit log detected!');
          console.log(`Block: ${blockNumber}, Transaction: ${transactionHash}`);

          // Fetch the transaction receipt to handle multiple deposits in the same transaction
          const txReceipt = await alchemy.core.getTransactionReceipt(transactionHash);
          const numDeposits = txReceipt.logs.length;

          // Process each log in the transaction receipt
          txReceipt.logs.forEach(async (receiptLog) => {
            if (receiptLog.address.toLowerCase() === depositContractAddress.toLowerCase()) {
              console.log('New deposit found in transaction:');

              // Extract deposit details
              const blockTimestamp = block.timestamp;
              const fee = ((txReceipt.gasUsed * receiptLog.gasPrice) / numDeposits).toString() // Calculate fee
              const pubkey = receiptLog.topics[1]; // Placeholder for decoding pubkey

              const deposit = {
                blockNumber: receiptLog.blockNumber,
                blockTimestamp: new Date(blockTimestamp * 1000),
                fee: fee,
                hash: receiptLog.transactionHash,
                pubkey: pubkey // Placeholder, actual decoding needed
              };

              // Save deposit to PostgreSQL
              await saveDepositToDB(deposit);

              // Send Telegram notification
              const message = `New deposit detected!\nBlock: ${deposit.blockNumber}\nTransaction: ${deposit.hash}\nFee: ${deposit.fee} ETH`;
              await sendTelegramNotification(message);
            }
          });
        });
      } else {
        console.log('No deposits in this block.');
      }
    } catch (fetchError) {
      console.error('Error fetching logs: ', fetchError);
    }
  });
};

module.exports = { trackDeposits };

