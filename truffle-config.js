require("babel-register");
require("babel-polyfill");

const HDWalletProvider = require('@truffle/hdwallet-provider');
const provider = new HDWalletProvider({
  privateKeys: ['YOUR-PRIVATE-KEY'],
  providerOrUrl: 'wss://data-seed-prebsc-2-s2.binance.org:8545/'
});

module.exports = {
  networks: {
    development: {
      provider: () => provider,
      network_id: "97",
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      version: "pragma",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
};
