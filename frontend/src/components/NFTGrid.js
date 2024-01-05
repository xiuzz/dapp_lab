import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NFTCard from './NFTCard'; 
import { balanceOf, tokenOfOwnerByIndex } from '../utils/nft';
import '../App.css';

//market 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
//nft 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
//usdt 0x5FbDB2315678afecb367f032d93F642f64180aa3
const NFTGrid = () => {
  const [nfts, setNfts] = useState([]);
  const navigate = useNavigate();

  const handleCardClick = (tokenId) => {
    navigate(`/nft-detail/${tokenId}`);
  };

  useEffect(() => {
    const fetchNFTs = async () => {
      const length = await balanceOf("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
      console.log(length);
      console.log('length', length)
      for (let i = 0; i < length; i++) {
        const tokenId = await tokenOfOwnerByIndex("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0", i);
        console.log('i', i)
        setNfts((prev) => [...prev, tokenId]);
        setNfts((prev) => [...new Set(prev)])
      }
    };
    fetchNFTs();
  }, []);

  return (
    <div className="nft-grid">
      {nfts.map(nft => (
        <NFTCard tokenId={nft} onClick={() => handleCardClick(nft)} />
      ))}
    </div>
  );
};

export default NFTGrid;