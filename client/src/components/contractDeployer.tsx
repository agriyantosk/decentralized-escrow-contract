"use client";

import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { ChangeEvent, useState } from "react";
import { FormData } from "../interface/interface";
import { deployContract } from "../utils/utilsFunction";

const ContractDeployer = () => {
    // State to store input values
    const [formData, setFormData] = useState<FormData>({
        arbiterAddress: "",
        beneficiaryAddress: "",
        balanceInEth: "",
    });

    // Function to handle input changes
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to handle button click
    const handleButtonClick = () => {
        // Log the input values to the console
        deployContract(formData);
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
                    type="text"
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
