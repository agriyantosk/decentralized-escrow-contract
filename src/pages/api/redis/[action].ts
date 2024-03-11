import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
    password: process.env.REDIS_PASSWORD as string,
    socket: {
        host: process.env.REDIS_SOCKET_HOST as string,
        port: Number(process.env.REDIS_SOCKET_PORT),
    },
});

(async () => {
    try {
        await client.connect();
        console.log("Connected to Redis successfully");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
        process.exit(1); // Exit if connection fails
    }
})();

export default async function connect(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { action } = req.query;
    let data;
    let contractAddress;
    let arbiterAddress;
    let beneficiaryAddress;
    let value;
    if (req.body) {
        data = JSON.parse(req.body);
        contractAddress = data.contractAddress;
        arbiterAddress = data.arbiterAddress;
        beneficiaryAddress = data.beneficiaryAddress;
        value = data.value;
    }
    try {
        if (action === "write") {
            if (
                !contractAddress ||
                !arbiterAddress ||
                !beneficiaryAddress ||
                !value
            ) {
                throw new Error("Missing required data in request body");
            }
            const redisData = {
                contractAddress,
                arbiterAddress,
                beneficiaryAddress,
                value,
            };
            const storeRedis = await client.hSet(
                "Escrow Contract Addresses",
                contractAddress,
                JSON.stringify(redisData)
            );
            res.status(200).json({ data: storeRedis });
        } else if (action === "get") {
            const allRedisData = await client.hGetAll(
                "Escrow Contract Addresses"
            );
            res.status(200).json({ data: allRedisData });
        } else if (action === "delete") {
            const deleteRedis = await client.hDel(
                "Escrow Contract Addresses",
                contractAddress
            );
            res.status(200).json({ data: deleteRedis });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "An Error Occured" });
    }
}
