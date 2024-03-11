import { Button } from "@nextui-org/react";
import { createWalletClient, custom } from "viem";
import Escrow from "../artifacts/contracts/Escrow.sol/Escrow.json";
import { sepolia } from "viem/chains";
import { publicClient } from "@/config";
import { ChangeEvent, useState } from "react";
import { MdOutlineClear } from "react-icons/md";

const EscrowContract = ({
    account,
    contracts,
    refetch,
    skeletonLoading,
    setSkeleton,
    setContracts,
}: any) => {
    const [searchInput, setSearchInput] = useState("");

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const search = async (e: any) => {
        e.preventDefault();
        const searchContract = contracts.filter((el: any) => {
            return el.contractAddress === searchInput;
        });
        setContracts(searchContract);
    };

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

            await publicClient.simulateContract({
                address: contractAddress,
                abi: Escrow.abi,
                functionName: "approve",
                account: account.address,
            });

            const hash = await client.writeContract({
                address: contractAddress,
                abi: Escrow.abi,
                functionName: "approve",
                account: account.address,
            });

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

    const clearSearch = () => {
        setSearchInput("");
        refetch();
    };

    return (
        <>
            <div className="border-2 border-black p-10 flex flex-col gap-5 w-full rounded-lg">
                <div className="flex justify-between items-center">
                    <h1>Deployed Contract</h1>
                    <div className="flex items-center w-[50%] justify-end">
                        <form onSubmit={search} className="w-[100%]">
                            <label
                                htmlFor="default-search"
                                className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                            >
                                Search
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                    id="default-search"
                                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search Contracts"
                                />
                                <button
                                    type="submit"
                                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Search
                                </button>
                            </div>
                        </form>
                        <MdOutlineClear
                            className="text-3xl text-gray-400 border-0 border-gray-400 cursor-pointer hover:text-gray-500"
                            onClick={() => clearSearch()}
                        />
                    </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto flex flex-col gap-10">
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
                        contracts &&
                        contracts.map((el: any, index: number) => {
                            return (
                                <>
                                    <div
                                        key={index}
                                        className="border-2 border-black p-5 flex flex-col gap-10 rounded-lg"
                                    >
                                        <div className="flex flex-col gap-5">
                                            <div>
                                                <h1>Contract Address:</h1>
                                                <h1>{el.contractAddress}</h1>
                                            </div>
                                            <div>
                                                <h1>Arbiter Address:</h1>
                                                <h1>{el.arbiterAddress}</h1>
                                            </div>
                                            <div>
                                                <h1>Beneficiary Address:</h1>
                                                <h1>{el.beneficiaryAddress}</h1>
                                            </div>
                                            <div>
                                                <h1>Value:</h1>
                                                <h1>{+el?.value} ETH</h1>
                                            </div>
                                        </div>
                                        <div className="flex justify-center">
                                            <Button
                                                onClick={() =>
                                                    approve(
                                                        el.contractAddress,
                                                        el.arbiterAddress
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
                        })
                    )}
                </div>
            </div>
        </>
    );
};

export default EscrowContract;
