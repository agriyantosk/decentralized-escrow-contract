import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
    solidity: "0.8.24",
    networks: {
        sepolia: {
            url: "https://eth-sepolia.g.alchemy.com/v2/nvG8iXEA2WZisKCsiu2X4K09_4OeHFA8",
            accounts: [
                "959c94b5a73506c58f14ccd4bb767ed8ae3ccd335bd92ad60a25dad37ba17e0c",
            ],
        },
    },
};

export default config;
