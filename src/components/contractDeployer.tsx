"use client";

import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import { FormData } from "../interface/interface";
import { ethers } from "ethers";
import { deployContract } from "@/utils/utilsFunction";

const ContractDeployer = ({ account, refetch, setSkeleton }: any) => {
    const [balance, setBalance] = useState<any>();

    async function getAccounts() {
        try {
            const provider = new ethers.AlchemyProvider(
                "sepolia",
                "nvG8iXEA2WZisKCsiu2X4K09_4OeHFA8"
            );
            const getBalance = await provider.getBalance(account.address);

            setBalance(getBalance);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAccounts();
    }, []);

    const [formData, setFormData] = useState<FormData>({
        arbiterAddress: "",
        beneficiaryAddress: "",
        balanceInEth: "",
    });

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const writeRedis = async () => {};

    const handleButtonClick = async () => {
        try {
            setSkeleton(true);
            const { arbiterAddress, beneficiaryAddress, balanceInEth } =
                formData;

            if (+ethers.formatEther(balance) < +formData.balanceInEth) {
                throw new Error("Insufficient Balance");
            }
            const deploy = await deployContract(
                account.address,
                arbiterAddress,
                beneficiaryAddress,
                balanceInEth
            );
            if (deploy) {
                await fetch("/api/redis/write", {
                    method: "POST",
                    body: JSON.stringify({
                        deployerAddress: account.address,
                        contractAddress: deploy.contractAddress,
                        arbiterAddress,
                        beneficiaryAddress,
                        value: balanceInEth,
                    }),
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            refetch();
        }
    };

    return (
        <>
            <div className="border-2 border-black p-10 flex items-center flex-col gap-10 w-[100%] rounded-lg">
                <>
                    <h1>Enter the contract detail below:</h1>
                    <Input
                        type="text"
                        color="default"
                        placeholder="Arbiter Address"
                        className="max-w-[500px] border-2 border-black p-2 rounded-lg"
                        name="arbiterAddress"
                        value={formData.arbiterAddress}
                        onChange={handleInputChange}
                    />
                    <Input
                        type="text"
                        color="default"
                        placeholder="Beneficiary Address"
                        className="max-w-[500px] border-2 border-black p-2 rounded-lg"
                        name="beneficiaryAddress"
                        value={formData.beneficiaryAddress}
                        onChange={handleInputChange}
                    />
                    <Input
                        type="number"
                        color="default"
                        placeholder="Desired ETH"
                        className="max-w-[500px] border-2 border-black p-2 rounded-lg"
                        name="balanceInEth"
                        value={formData.balanceInEth}
                        onChange={handleInputChange}
                    />
                    <Button
                        className="bg-blue-500 rounded-lg w-[50%] text-white hover:bg-blue-400 py-2"
                        onClick={handleButtonClick}
                    >
                        Button
                    </Button>
                </>
            </div>
        </>
    );
};

export default ContractDeployer;
