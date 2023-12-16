import { ethers } from 'ethers';
import MyNFTABI from '../contracts/MyNFT.json';

async function main() {
  let provider = new ethers.BrowserProvider(window.ethereum)
  const contractAddress = "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB";
  let account = await provider.getSigner();

  const contract = new ethers.Contract(contractAddress, MyNFTABI, account);
  const result = await contract.totalSupply();
  await contract.safeMint('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'https://ipfs.io/ipfs/QmZ4tj')
  console.log(result.toString());
}


export default main;