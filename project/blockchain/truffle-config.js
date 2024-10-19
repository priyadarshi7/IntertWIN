module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Change to Ganache port
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Specify your Solidity version
    },
  },
};
