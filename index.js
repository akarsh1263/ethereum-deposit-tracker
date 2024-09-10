require('dotenv').config();
const { trackDeposits } = require('./handler');

// Start tracking Ethereum deposits
trackDeposits();
