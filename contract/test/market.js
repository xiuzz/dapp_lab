const {expect} = require("chai");
const {ethers} = require("hardhat");


describe("Market", function() {
    let usdt, nft, market, accountA, accountB;
    beforeEach(async () => {
        [accountA, accountB] = await ethers.getSigners();

        let USDT = await ethers.getContractFactory("cUSDT");
        usdt = await USDT.deploy();
    
        let NFT = await ethers.getContractFactory("NFTM");
        nft = await NFT.deploy(accountA.address);
    
        let Market = await ethers.getContractFactory("Market");
        market = await Market.deploy(usdt.target, nft.target);
        
        await nft.safeMint(accountB.address,"http://temp.com");
        await nft.safeMint(accountB.address,"http://temp.com");
        await nft.connect(accountB).setApprovalForAll(accountA.address, true);
        // await nft.approve(market.target, 0);
        // await nft.approve(market.target, 1);
        await usdt.approve(market.target, "10000000000000000000000");
    });

    it("it's erc20 address should be usdt", async function() {
        expect(await market.erc20()).to.equal(usdt.target);
    })

    it("it's erc721 address should be nft", async function() {
        expect(await market.erc721()).to.equal(nft.target);
    })

    it("account b should have two nfts", async function() {
        expect(await nft.balanceOf(accountB.address)).to.equal(2);
    })

    it("account a should have 10000 ustd", async function() {
        expect(await usdt.balanceOf(accountA.address)).to.equal("100000000000000000000000000");
    })

    it('account a should have 0 nfts', async function() {
        expect(await nft.balanceOf(accountA.address)).to.equal(0);
    });

    it("account b can list two nfts to market", async function() {
        const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";

        expect(await nft["safeTransferFrom(address, address, uint256, bytes)"]
        (accountB.address, market.target, 0, price)).to.emit(market,"NewOrder");

        expect(await nft["safeTransferFrom(address, address, uint256, bytes)"]
        (accountB.address, market.target, 1, price)).to.emit(market,"NewOrder");
        
        expect(await nft.balanceOf(accountB.address)).to.equal(0);
        expect(await nft.balanceOf(market.target)).to.equal(2);
        expect(await market.isListed(0)).to.equal(true);
        expect(await market.isListed(1)).to.equal(true);
        
        const x = await market.getAllNFTs();

        expect(x[Object.keys(x)[0]]).to.deep.equal([accountB.address, "0", price]);
        expect(x[Object.keys(x)[1]]).to.deep.equal([accountB.address, "1", price]);

        expect(await market.getOrderLength()).to.equal(2);

        const y = await market.connect(accountB).getMyNFTS()
        
        expect(y[Object.keys(x)[0]]).to.deep.equal([accountB.address, "0", price]);
    })

    it('account b can unlist one nft from market', async function() {
        const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";

        expect(await nft["safeTransferFrom(address, address, uint256, bytes)"]
        (accountB.address, market.target, 0, price)).to.emit(market,"NewOrder");

        expect(await nft["safeTransferFrom(address, address, uint256, bytes)"]
        (accountB.address, market.target, 1, price)).to.emit(market,"NewOrder");
        
        expect(await market.connect(accountB).cancelOrder(0)).to.emit(market, "OrderCancelled");
        expect(await market.connect(accountB).cancelOrder(1)).to.emit(market, "OrderCancelled");

        expect(await nft.balanceOf(accountB.address)).to.equal(2);
        expect(await nft.balanceOf(market.target)).to.equal(0);
        expect(await market.isListed(0)).to.equal(false);
        expect(await market.isListed(1)).to.equal(false);
    })
      
    it('account b can change price of nft from market', async function() {
        const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";
        
        expect(await nft["safeTransferFrom(address, address, uint256, bytes)"]
        (accountB.address, market.target, 0, price)).to.emit(market,"NewOrder");

        expect(await nft["safeTransferFrom(address, address, uint256, bytes)"]
        (accountB.address, market.target, 1, price)).to.emit(market,"NewOrder");

        expect(await market.connect(accountB).changePrice(0,"114514")).to.emit(market, "PrinceChanged");
        expect(await market.connect(accountB).changePrice(1,"1919824")).to.emit(market, "PrinceChanged");

        const x = await market.getAllNFTs();

        expect(x[Object.keys(x)[0]]).to.deep.equal([accountB.address, "0", "114514"]);
        expect(x[Object.keys(x)[1]]).to.deep.equal([accountB.address, "1", "1919824"]);
    })
      
    it('account a can buy nft from market', async function() {
        const price = "0x0000000000000000000000000000000000000000000000000001c6bf52634000";
        
        expect(await nft["safeTransferFrom(address, address, uint256, bytes)"]
        (accountB.address, market.target, 0, price)).to.emit(market,"NewOrder");

        expect(await nft["safeTransferFrom(address, address, uint256, bytes)"]
        (accountB.address, market.target, 1, price)).to.emit(market,"NewOrder");
        

        expect(await market.connect(accountA).buy(0)).to.emit(market, "Deal");
        expect(await market.connect(accountA).buy(1)).to.emit(market, "Deal");

        expect(await nft.balanceOf(accountB.address)).to.equal(0);
        expect(await nft.balanceOf(market.target)).to.equal(0);
        expect(await nft.balanceOf(accountA.address)).to.equal(2);
    })
});