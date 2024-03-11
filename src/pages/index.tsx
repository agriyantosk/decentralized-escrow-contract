import Image from "next/image";
import { Inter } from "next/font/google";
import EscrowContract from "@/components/escrowContract";
import ContractDeployer from "@/components/contractDeployer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const [contracts, setContracts] = useState<any>();
    const [account, setAccount] = useState<any>();

    const fetchContract = async () => {
        try {
            console.log("refetchBerhasil");
            const response = await fetch("api/redis/get");
            const data = await response.json();
            const result = [];
            for (const key in data) {
                const contracts = data[key];
                for (const key in contracts) {
                    result.push(contracts[key]);
                }
            }
            setContracts(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchContract();
    }, []);

    return (
        <>
            <div className="h-screen w-screen flex flex-col items-center justify-center justify-items-center">
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
                                            <button
                                                onClick={openConnectModal}
                                                type="button"
                                            >
                                                Connect Wallet
                                            </button>
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
                                            <div className="flex gap-3 justify-end w-full">
                                                <button
                                                    onClick={openChainModal}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                    }}
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
                                                    onClick={openAccountModal}
                                                    type="button"
                                                >
                                                    {account.displayName}
                                                    {account.displayBalance
                                                        ? ` (${account.displayBalance})`
                                                        : ""}
                                                </button>
                                            </div>
                                            <div className="flex flex-col gap-10">
                                                <div className="flex justify-center">
                                                    <h1>
                                                        Escrow Smart Contract
                                                        Generator
                                                    </h1>
                                                </div>
                                                <div className="flex justify-evenly gap-10">
                                                    <ContractDeployer
                                                        account={account}
                                                        refetch={fetchContract}
                                                    />
                                                    <EscrowContract
                                                        account={account}
                                                        contracts={contracts}
                                                        refetch={fetchContract}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </>
                        );
                    }}
                </ConnectButton.Custom>
            </div>
        </>
    );
}
