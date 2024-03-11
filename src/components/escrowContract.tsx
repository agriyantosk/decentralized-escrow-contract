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
import { useEffect, useState } from "react";

const EscrowContract = ({
    account,
    contracts,
    refetch,
    skeletonLoading,
    setSkeleton,
}: any) => {
    // const retrieveContract = localStorage.getItem("contractAddresses");
    // const contracts = JSON.parse(retrieveContract as string);

    const approve = async (
        contractAddress: `0x${string}`,
        arbiterAddress: string
    ) => {
        try {
            setSkeleton(true);
            if (arbiterAddress !== account.address)
                return alert("You are not the arbiter");
            const client = createWalletClient({
                account: account.address,
                chain: sepolia,
                transport: custom(window.ethereum),
            });
            console.log(client);

            const { request } = await publicClient.simulateContract({
                address: contractAddress,
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
            const deleteRedis = await fetch("/api/redis/delete", {
                method: "POST",
                body: JSON.stringify({
                    contractAddress: successTransactionAddress,
                }),
            });
        } catch (e) {
            console.log(e);
        } finally {
            refetch();
        }
    };

    return (
        <>
            <div className="border-2 border-black p-10 flex flex-col gap-10 w-[100%] rounded-lg">
                {skeletonLoading ? (
                    <div
                        role="status"
                        className="max-w-sm animate-pulse w-[100%]"
                    >
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                    <>
                        <h1>Deployed Contract</h1>
                        <div className="max-h-[400px] overflow-y-auto flex flex-col gap-10">
                            {contracts &&
                                contracts?.map((el: any, index: number) => {
                                    const parsed = JSON.parse(el);
                                    return (
                                        <>
                                            <div
                                                key={index}
                                                className="border-2 border-black p-5 flex flex-col gap-10 rounded-lg"
                                            >
                                                <div className="flex justify-evenly gap-10">
                                                    <div>
                                                        <div className="mb-5">
                                                            <h1>
                                                                Contract
                                                                Address:
                                                            </h1>
                                                            <h1>
                                                                {
                                                                    parsed.contractAddress
                                                                }
                                                            </h1>
                                                        </div>
                                                        <div className="mb-5">
                                                            <h1>
                                                                Arbiter Address:
                                                            </h1>
                                                            <h1>
                                                                {
                                                                    parsed.arbiterAddress
                                                                }
                                                            </h1>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="mb-5">
                                                            <h1>
                                                                Beneficiary
                                                                Address:{" "}
                                                            </h1>
                                                            <h1>
                                                                {
                                                                    parsed.beneficiaryAddress
                                                                }
                                                            </h1>
                                                        </div>
                                                        <div className="mb-5">
                                                            <h1>Value:</h1>
                                                            <h1>
                                                                {+parsed?.value}{" "}
                                                                ETH
                                                            </h1>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-center">
                                                    <Button
                                                        onClick={() =>
                                                            approve(
                                                                parsed.contractAddress,
                                                                parsed.arbiterAddress
                                                            )
                                                        }
                                                        className="text-center bg-blue-500 rounded-lg w-[25%] text-white hover:bg-blue-400 py-2"
                                                    >
                                                        Approve
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default EscrowContract;
