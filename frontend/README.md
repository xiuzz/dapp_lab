## 前端交互接口设计

合约地址
MyNFT: 0x5FbDB2315678afecb367f032d93F642f64180aa3
cUSDT: 0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB
Market: 0x9E545E3C0baAB3E08CdfD552C960A1050f373042

备注：不同环境部署出来的合约地址可能不一样，以实际为准

### 购买NFT
0. 查询allowance, 如果为0或者不足，先调用approve
1. 调用 erc20.approve(spender, amount) 批准Market合约转币；
2. 调用 market.buy(tokenId) 购买；

### 挖NFT

前端上传图片，其他步骤在后端完成：
1. 图片上传到 IPFS 并返回 CID；
2. 生成 Metadata 并返回 CID；
3. Mint NFT给用户；

### 改价格

调用 market.changePrice(tokenId, price)

### 下架

调用 market.cancelOrder(tokenId)

### 查询市场所有NFT

调用 market.getAllNFTs()
调用 nft.token(URI)

### 查询个人所有NFT

调用 market.getMyNFTs()
调用 erc721.balanceOf(address)
调用 erc721.tokenOfOwnerByIndex(owner, index)
调用 erc721.tokenURI(tokenId)
