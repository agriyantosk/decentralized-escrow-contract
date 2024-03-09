import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(
        "https://eth-sepolia.g.alchemy.com/v2/nvG8iXEA2WZisKCsiu2X4K09_4OeHFA8"
    ),
});
