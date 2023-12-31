import express from "express";
import bodyParser from "body-parser"
import fileUpload from "express-fileupload";
import cors from "cors";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./ipfs-uploader.js";
import { mint } from "./nft-minter.js";
import dotenv from "dotenv";
dotenv.config("./.env");

const app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use(cors());
app.get("/", (req,res) => {
    res.render("home");
})

app.post("/upload", (req, res) => {
    const title = req.body.title;
    const description = req.body.description;

    const file = req.files.file;
    const filename = file.name;
    const filePath = "files/" + filename;
    const address = req.body.address;
    file.mv(filePath,async (err) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        const fileResult = await uploadFileToIPFS(filePath);
        const fileCid = fileResult.cid.toString();
        const metadata = {
            title: title,
            description: description,
            image: `${process.env.IPFSURL}/${fileCid}`
        }
        const metadataResult = await uploadJSONToIPFS(metadata);
        const metadataCid = metadataResult.cid.toString();
        const userAddress = address || process.env.ACCOUNTADDRESS;
        console.log(userAddress);
        await mint(`${userAddress}`,`${process.env.IPFSURL}/${metadataCid}`);
        res.json(
            {
                message:"ok",
                metadata:metadata
            }
        )
    })
})

function main() {
    app.listen(port, ()=> {
        console.log(`Server is listening ${port}`);
    })
}


main()