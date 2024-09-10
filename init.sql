-- Create the Deposit table
CREATE TABLE IF NOT EXISTS Deposit (
    id SERIAL PRIMARY KEY,
    blockNumber BIGINT NOT NULL,
    blockTimestamp TIMESTAMPTZ NOT NULL,
    fee NUMERIC(18, 8),
    hash VARCHAR(66) NOT NULL,
    pubkey VARCHAR(128) NOT NULL
);
