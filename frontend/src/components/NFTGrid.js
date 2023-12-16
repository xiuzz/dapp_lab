import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NFTCard from './NFTCard'; 
import { balanceOf, tokenOfOwnerByIndex } from '../utils/nft';
import '../App.css';

//market 0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB
//nft 0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E
//usdt 0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690
const NFTGrid = () => {
  const [nfts, setNfts] = useState([]);
  const navigate = useNavigate();

  const handleCardClick = (tokenId) => {
    navigate(`/nft-detail/${tokenId}`);
  };

  useEffect(() => {
    const fetchNFTs = async () => {
      const length = await balanceOf("0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB");
      console.log(length);
      console.log('length', length)
      for (let i = 0; i < length; i++) {
        const tokenId = await tokenOfOwnerByIndex("0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB", i);
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