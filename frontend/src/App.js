import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import UploadImage from './components/UploadImage.js';
import Navbar from './components/Navbar.js';
import UploadSuccess from './components/UploadSuccess.js';
import NFTGrid from './components/NFTGrid.js';
import NFTDetail from './components/NFTDetail.js';

function App() {
  const [walletAddress, setWallet] = useState("");

  useEffect(() => {
    getWalletAddress()
    addWalletListener()
  },[]);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
        }
      });
    }   
  }
  
  async function getWalletAddress() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]); // Set the first account as the connected account
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    }
  };
  
  return (
    <div id="container">
      <Router>
        <Navbar walletAddress={walletAddress} getWalletAddress={getWalletAddress}/>
        
        <Routes>
          <Route path="/create-nft" exact element={<UploadImage address={walletAddress}/>} />
          <Route path="/success" element={<UploadSuccess />} />
          <Route path="/" element={<NFTGrid />} />
          <Route path="/nft-detail/:tokenId" element={<NFTDetail />} />
        </Routes>
      </Router>
    </div> 
  );
};

export default App;
