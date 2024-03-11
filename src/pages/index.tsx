import Image from "next/image";
import { Inter } from "next/font/google";
import EscrowContract from "@/components/escrowContract";
import ContractDeployer from "@/components/contractDeployer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import Loading from "@/components/loading";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [contracts, setContracts] = useState<any>();
    const [loading, setLoading] = useState<boolean>(true);
    const [skeletonLoading, setSkeletonLoading] = useState<boolean>();

    const fetchContract = async () => {
        try {
            setLoading(true);
            const response = await fetch("api/redis/get");
            const data = await response.json();
            const result = [];
            for (const key in data) {
                const contracts = data[key];
                for (const key in contracts) {
                    const contractString = contracts[key];
                    const contractObject = JSON.parse(contractString);
                    result.push(contractObject);
                }
            }
            setContracts(result);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setSkeletonLoading(false);
        }
    };

    useEffect(() => {
        fetchContract();
    }, []);

    return (
        <>
            <div className="h-screen w-screen flex flex-col justify-center items-center">
                {loading ? (
                    <div role="status">
                        <svg
                            aria-hidden="true"
                            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                    <ConnectButton.Custom>
                        {({
                            account,
                            chain,
                            openAccountModal,
                            openChainModal,
                            openConnectModal,
                            authenticationStatus,
                            mounted,
                        }) => {
                            // Note: If your app doesn't use authentication, you
                            // can remove all 'authenticationStatus' checks
                            const ready =
                                mounted && authenticationStatus !== "loading";
                            const connected =
                                ready &&
                                account &&
                                chain &&
                                (!authenticationStatus ||
                                    authenticationStatus === "authenticated");
                            return (
                                <>
                                    {(() => {
                                        if (!connected) {
                                            return (
                                                <>
                                                    <div className="flex flex-col gap-10 w-full justify-center items-center">
                                                        <h1 className="text-5xl">
                                                            Escrow Smart
                                                            Contract Generator
                                                        </h1>
                                                        <button
                                                            className="text-center bg-blue-500 rounded-lg w-[10%] text-white hover:bg-blue-400 py-2"
                                                            onClick={
                                                                openConnectModal
                                                            }
                                                            type="button"
                                                        >
                                                            Connect Wallet
                                                        </button>
                                                    </div>
                                                </>
                                            );
                                        }

                                        if (chain.unsupported) {
                                            return (
                                                <button
                                                    onClick={openChainModal}
                                                    type="button"
                                                >
                                                    Wrong network
                                                </button>
                                            );
                                        }
                                        // setAccount(account);
                                        return (
                                            <>
                                                <div className="flex flex-col gap-3 w-full h-full justify-center px-10">
                                                    <div className="flex justify-center">
                                                        <h1 className="text-5xl">
                                                            Escrow Smart
                                                            Contract Generator
                                                        </h1>
                                                    </div>
                                                    <div>
                                                        <div className="w-full items-end flex justify-end">
                                                            <div className="flex gap-3 p-2 mb-2 border-2 border-black rounded-lg w-max">
                                                                <button
                                                                    onClick={
                                                                        openChainModal
                                                                    }
                                                                    className="flex items-center"
                                                                    type="button"
                                                                >
                                                                    {chain.hasIcon && (
                                                                        <div
                                                                            style={{
                                                                                background:
                                                                                    chain.iconBackground,
                                                                                width: 12,
                                                                                height: 12,
                                                                                borderRadius: 999,
                                                                                overflow:
                                                                                    "hidden",
                                                                                marginRight: 4,
                                                                            }}
                                                                        >
                                                                            {chain.iconUrl && (
                                                                                <img
                                                                                    alt={
                                                                                        chain.name ??
                                                                                        "Chain icon"
                                                                                    }
                                                                                    src={
                                                                                        chain.iconUrl
                                                                                    }
                                                                                    style={{
                                                                                        width: 12,
                                                                                        height: 12,
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                    {chain.name}
                                                                </button>

                                                                <button
                                                                    onClick={
                                                                        openAccountModal
                                                                    }
                                                                    type="button"
                                                                >
                                                                    {
                                                                        account.displayName
                                                                    }
                                                                    {account.displayBalance
                                                                        ? ` (${account.displayBalance})`
                                                                        : ""}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-evenly h-full w-full gap-10">
                                                            <ContractDeployer
                                                                account={
                                                                    account
                                                                }
                                                                refetch={
                                                                    fetchContract
                                                                }
                                                                setSkeleton={
                                                                    setSkeletonLoading
                                                                }
                                                                skeletonLoading={
                                                                    skeletonLoading
                                                                }
                                                            />
                                                            <EscrowContract
                                                                account={
                                                                    account
                                                                }
                                                                contracts={
                                                                    contracts
                                                                }
                                                                refetch={
                                                                    fetchContract
                                                                }
                                                                skeletonLoading={
                                                                    skeletonLoading
                                                                }
                                                                setSkeleton={
                                                                    setSkeletonLoading
                                                                }
                                                                setContracts={
                                                                    setContracts
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </>
                            );
                        }}
                    </ConnectButton.Custom>
                )}
            </div>
        </>
    );
}
