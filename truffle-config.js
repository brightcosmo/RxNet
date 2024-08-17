module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,  // Changed to 9545 to match Truffle's default development network
      network_id: "*",
    },
    pi: {
      host: "132.199.123.236",
      port: 8501,
      network_id: 2101993,
      gas: 4500000,
      gasPrice: 20000000000,
    },
    weiden: {
      host: "localhost",
      port: 8501,
      network_id: 1778,
      gas: 4500000,
      gasPrice: 20000000000,
    },
  },

  mocha: {
    timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.5.9",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  },

  // Remove the external compiler configuration as it's not directly related to Solidity compilation
  // and might be causing issues
};