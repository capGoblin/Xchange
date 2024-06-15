import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    zg: {
      url: "https://rpc-testnet.0g.ai",
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
