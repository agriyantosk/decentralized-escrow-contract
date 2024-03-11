"use client";

import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import { FormData } from "../interface/interface";
import { ethers } from "ethers";
import { deployContract } from "@/utils/utilsFunction";

const ContractDeployer = ({ account, refetch }: any) => {
    const [signer, setSigner] = useState<any>();
    const [balance, setBalance] = useState<any>();

    async function getAccounts() {
        try {
            // Initialize a provider (assuming you have an Ethereum node running at 'http://localhost:8545')
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
            console.log(deploy);
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
                console.log("selamat anda berhasil");
            }
            // const existingAddressesString =
            //     localStorage.getItem("contractAddresses");
            // const existingAddresses = existingAddressesString
            //     ? JSON.parse(existingAddressesString)
            //     : [];
            // existingAddresses.push(deploy);

            // await localStorage.setItem(
            //     "contractAddresses",
            //     JSON.stringify(existingAddresses)
            // );
            // console.log(existingAddresses, "local storage");
        } catch (error) {
            console.log(error);
        } finally {
            refetch();
        }
    };

    return (
        <>
            <div className="border-2 border-black p-20 flex flex-col gap-10 rounded-lg">
                <h1>Enter the contract detail below:</h1>
                <Input
                    type="text"
                    color="default"
                    label="Arbiter Address"
                    placeholder="0x..."
                    className="max-w-[300px] border-2 border-black p-2 rounded-lg"
                    name="arbiterAddress"
                    value={formData.arbiterAddress}
                    onChange={handleInputChange}
                />
                <Input
                    type="text"
                    color="default"
                    label="Beneficiary Address"
                    placeholder="0x..."
                    className="max-w-[300px] border-2 border-black p-2 rounded-lg"
                    name="beneficiaryAddress"
                    value={formData.beneficiaryAddress}
                    onChange={handleInputChange}
                />
                <Input
                    type="number"
                    color="default"
                    label="Balance in ETH"
                    placeholder="1"
                    className="max-w-[300px] border-2 border-black p-2 rounded-lg"
                    name="balanceInEth"
                    value={formData.balanceInEth}
                    onChange={handleInputChange}
                />
                <Button color="primary" onClick={handleButtonClick}>
                    Button
                </Button>
            </div>
        </>
    );
};

export default ContractDeployer;
