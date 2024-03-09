import { Button } from "@nextui-org/react";
import {
    createWalletClient,
    formatGwei,
    custom,
    createPublicClient,
    http,
} from "viem";
import Escrow from "../artifacts/contracts/Escrow.sol/Escrow.json";
import { ethers } from "hardhat";
import { sepolia } from "viem/chains";
import { publicClient } from "@/config";

const EscrowContract = ({ account }: any) => {
    const retrieveContract = localStorage.getItem("contractAddresses");
    const contracts = JSON.parse(retrieveContract as string);

    const approve = async (
        transactionAddress: `0x${string}`,
        arbiterAddress: string
    ) => {
        try {
            if (arbiterAddress !== account.address)
                return alert("You are not the arbiter");
            const client = createWalletClient({
                account: account.address,
                chain: sepolia,
                transport: custom(window.ethereum),
            });
            console.log(client);

            const { request } = await publicClient.simulateContract({
                address: transactionAddress,
                abi: Escrow.abi,
                functionName: "approve",
                account: account.address,
            });

            console.log(request, "request");

            const hash = await client.writeContract(request);

            const receipt = await publicClient.waitForTransactionReceipt({
                hash,
                confirmations: 1,
            });
            const successTransactionAddress = receipt.logs[0].address;
            console.log(receipt, "successTransactionAddress");
            if (successTransactionAddress) {
                let newStorage = contracts.filter(
                    (e: any) =>
                        e.transactionAddress !== successTransactionAddress
                );
                localStorage.removeItem("contractAddress");
                localStorage.setItem("contractAddress", newStorage);
            }
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <>
            <div className="border-2 border-black p-20 flex flex-col gap-10 rounded-lg">
                <h1>Deployed Contract</h1>
                <div className="max-h-[400px] overflow-y-auto flex flex-col gap-10">
                    {contracts &&
                        contracts?.map((el: any) => {
                            return (
                                <>
                                    <div className="border-2 border-black p-5 rounded-lg">
                                        <div className="flex gap-10">
                                            <div>
                                                <div className="mb-5">
                                                    <h1>
                                                        Transaction Address:
                                                    </h1>
                                                    <h1>
                                                        {el.transactionAddress}
                                                    </h1>
                                                </div>
                                                <div className="mb-5">
                                                    <h1>Arbiter Address:</h1>
                                                    <h1>{el.arbiterAddress}</h1>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="mb-5">
                                                    <h1>
                                                        Beneficiary Address:{" "}
                                                    </h1>
                                                    <h1>
                                                        {el.beneficiaryAddress}
                                                    </h1>
                                                </div>
                                                <div className="mb-5">
                                                    <h1>Value:</h1>
                                                    <h1>
                                                        {+el?.value / 1e18} ETH
                                                    </h1>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() =>
                                                approve(
                                                    el.transactionAddress,
                                                    el.arbiterAddress
                                                )
                                            }
                                            className="w-full text-center"
                                        >
                                            Approve
                                        </Button>
                                    </div>
                                </>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default EscrowContract;
