import {create} from "kubo-rpc-client"
import fs from "fs"
import dotenv from "dotenv";
dotenv.config("./.env");
const ipfs = create(`${process.env.IPFSSENDURL}`);

export async function uploadFileToIPFS(filePath) {
    const file = fs.readFileSync(filePath);
    const res = await ipfs.add({path:filePath, content:file});
    console.log(`${Date()}: up load file to IPFS:${res.cid}`);
    return res;
}

export async function uploadJSONToIPFS(json) {
    const res = await ipfs.add(JSON.stringify(json));   
    console.log(`${Date()}: up load json to IPFS:${res.cid}`);
    return res;
}

