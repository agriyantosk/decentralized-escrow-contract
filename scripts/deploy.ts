import { ethers } from "hardhat";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import Escrow from "../artifacts/contracts/Escrow.sol/Escrow.json";

export default async function deploy(
    walletClient: any,
    arbiter: string,
    beneficiary: string,
    value: any
) {
    try {
        console.log(walletClient, arbiter, beneficiary, value);
        const hash = await walletClient.deployContract({
            abi: Escrow.abi,
            bytecode: Escrow.bytecode,
            args: [arbiter, beneficiary],
            value,
        });
        console.log(hash, "hash");
        const publicClient = createPublicClient({
            chain: sepolia,
            transport: http(
                "https://eth-sepolia.g.alchemy.com/v2/nvG8iXEA2WZisKCsiu2X4K09_4OeHFA8"
            ),
        });
        console.log(publicClient, "publicClient");
        const tx = await publicClient.waitForTransactionReceipt({
            hash,
        });
        console.log(tx, tx);

        return { address: tx.contractAddress };
    } catch (error) {
        console.log(error);
    }
}
