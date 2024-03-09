import { ethers } from "hardhat";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import Escrow from "../artifacts/contracts/Escrow.sol/Escrow.json";
import { publicClient } from "@/config";

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

        const tx = await publicClient.waitForTransactionReceipt({
            hash,
        });

        return { address: tx.contractAddress };
    } catch (error) {
        console.log(error);
    }
}
