import { FormData } from "../interface/interface";
import Escrow from "../artifacts/contracts/Escrow.sol/Escrow.json";
import { ethers } from "ethers";
import { createWalletClient, custom, parseEther } from "viem";
import { sepolia } from "viem/chains";
import deploy from "../../scripts/deploy";
import { useWriteContract } from "wagmi";

const checkIsWallet = async (address: string) => {
    try {
        const isWallet = await ethers.isAddress(address);
        return isWallet;
    } catch (error) {
        console.log(error);
    }
};

export async function deployContract(
    address: `0x${string}`,
    arbiter: string,
    beneficiary: string,
    value: any
) {
    try {
        if (!arbiter || !beneficiary || !value) {
            return alert("Please fill all the fields");
        }
        const arbiterIsWallet = await checkIsWallet(arbiter);
        const beneficiaryIsWallet = await checkIsWallet(beneficiary);
        if (!arbiterIsWallet || !beneficiaryIsWallet) {
            throw new Error("Invalid address input!");
        }
        const client = createWalletClient({
            account: address,
            chain: sepolia,
            transport: custom(window.ethereum),
        });

        const ethValue = parseEther(value);
        const tx = await deploy(client, arbiter, beneficiary, ethValue);

        const contract = {
            transactionAddress: tx?.address,
            arbiterAddress: arbiter,
            beneficiaryAddress: beneficiary,
            value: ethValue.toString(),
        };
        return contract;
    } catch (error) {
        console.log(error);
    }
}
