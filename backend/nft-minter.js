import {ethers, JsonRpcProvider} from "ethers";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config("./.env");

export async function mint(to, url) {
    const provider = new JsonRpcProvider(`${process.env.ETHURL}`);
    const signer = await provider.getSigner();
    const contractAddress = `${process.env.CONTRACTADDRESS}`;

    const abi = JSON.parse(fs.readFileSync("./abis/MyNFT.json"));
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const result = await contract.safeMint(to, url);
    console.log(`${Date()}:a contract call:${result.hash}`);
}