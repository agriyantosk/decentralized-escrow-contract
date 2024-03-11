import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config()

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    defaultNetwork: "localhost",
    networks: {
        sepolia: {
            url: process.env.ALCHEMY_SEPOLIA_URL,
            accounts: [process.env.WALLET_PRIVATE_KEY as string],
        },
    },
};

export default config;
