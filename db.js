require('dotenv').config();
const { Client } = require('pg');

// Create a new PostgreSQL client using environment variables
const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

client.connect();

// Function to save deposit details to the PostgreSQL database
const saveDepositToDB = async (deposit) => {
  const query = `
    INSERT INTO deposits (blockNumber, blockTimestamp, fee, hash, pubkey)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [
    deposit.blockNumber,
    deposit.blockTimestamp,
    deposit.fee,
    deposit.hash,
    deposit.pubkey
  ];

  try {
    await client.query(query, values);
    console.log('Deposit saved to database');
  } catch (err) {
    console.error('Error saving to database: ', err);
  }
};

module.exports = { saveDepositToDB };
