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

const checkBalance = async () => {
    try {
        // const balance = await ethers.
    } catch (error) {
        console.log(error);
    }
};

// export async function deploy(formData: FormData, signer: any) {
//     try {
//         const { arbiterAddress, beneficiaryAddress, balanceInEth } = formData;
//         const checkArbiter = await checkIsWallet(arbiterAddress);
//         const checkBeneficiary = await checkIsWallet(beneficiaryAddress);
//         if (!checkArbiter || !checkBeneficiary) {
//             throw new Error("Invalid Address Input");
//         }
//         const factory = new ethers.ContractFactory(
//             Escrow.abi,
//             Escrow.bytecode,
//             signer
//         );

//         const balanceInWei = ethers.parseEther(balanceInEth.toString());
//         console.log(balanceInWei);
//         const deployedContract = await factory.deploy(
//             arbiterAddress,
//             beneficiaryAddress,
//             { value: balanceInWei }
//         );
//         console.log(
//             "Contract has been deployed to: ",
//             deployedContract.getAddress()
//         );
//         return await deployedContract.getAddress();
//     } catch (error) {
//         console.log(error);
//     }
// }

export async function deployContract(
    address: `0x${string}`,
    arbiter: string,
    beneficiary: string,
    value: any
) {
    try {
        console.log(address, arbiter, beneficiary, value);
        if (!arbiter || !beneficiary || !value) {
            return alert("Please fill all the fields");
        }
        const client = createWalletClient({
            account: address,
            chain: sepolia,
            transport: custom(window.ethereum),
        });
        const ethValue = parseEther(value);
        const tx = await deploy(client, arbiter, beneficiary, ethValue);
        return tx?.address;
    } catch (error) {
        console.log(error);
    }
}
