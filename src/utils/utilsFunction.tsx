import { FormData } from "../interface/interface";
import Escrow from "../artifacts/contracts/Escrow.sol/Escrow.json";
import { ethers } from "ethers";
import { createWalletClient, custom, parseEther } from "viem";
import { sepolia } from "viem/chains";
import deploy from "../../scripts/deploy";

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
        const client = createWalletClient({
            account: address,
            chain: sepolia,
            transport: custom(window.ethereum),
        });
        console.log(client, "client");
        const ethValue = parseEther(value);
        const tx = await deploy(client, arbiter, beneficiary, ethValue);
        console.log(tx, "tx dari utilsFunction");
        const contract = {
            transactionAddress: tx?.address,
            aribterAddress: arbiter,
            beneficiaryAddress: beneficiary,
            value: ethValue.toString(),
        };
        return contract;
    } catch (error) {
        console.log(error);
    }
}
