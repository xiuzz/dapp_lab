// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./erc20-usdt.sol";
import "./erc721-nft.sol";

contract Market {

    IERC20 public erc20;
    IERC721 public erc721; 

    bytes4 internal constant MAGIC_ON_ERC721_RECEIVED = 0x150b7a02;

    struct Order {
        address seller;
        uint256 tokenId;
        uint256 price;
    }

    mapping (uint256 => Order) public orderOfId;
    uint256[] keys;
    mapping (address => uint256) public sellerTokenLegth;

    constructor(address _erc20, address _erc721) {
        require(_erc20 != address(0), "null address");
        require(_erc721 != address(0), "null address");
        erc20 = IERC20(_erc20);
        erc721 = IERC721(_erc721);
    }

    event Deal(address seller, address buyer, uint256 tokenId, uint price);
    event NewOrder(address seller, uint256 tokenID, uint256 price);
    event PrinceChanged(address seller, uint256 tokenId, uint256 prePrice, uint256 curPrice);
    event OrderCancelled(address seller, uint256 tokenId);

    function buy(uint _tokenId) external {
        address seller = orderOfId[_tokenId].seller;
        address buyer = msg.sender;
        uint256 price = orderOfId[_tokenId].price;

        require(erc20.transferFrom(buyer, seller, price), "transfer not successful");
        erc721.safeTransferFrom(address(this), buyer, _tokenId);

        removeOrder(_tokenId, seller);

        emit Deal(seller, buyer, _tokenId, price);
    }

    function cancelOrder(uint256 _tokenId) external {
        address seller = orderOfId[_tokenId].seller;
        require(msg.sender == seller, "not seller");
        erc721.safeTransferFrom(address(this), seller, _tokenId);

        removeOrder(_tokenId, msg.sender);

        emit OrderCancelled(seller, _tokenId);  
    }

    function changePrice(uint256 _tokenId, uint256 _price) external {
        address seller = orderOfId[_tokenId].seller;
        require(msg.sender == seller, "not seller");

        uint256 prePrice = orderOfId[_tokenId].price;
        orderOfId[_tokenId].price = _price;

        emit PrinceChanged(seller, _tokenId, prePrice, _price);
    }   

    function toUint256(bytes memory _bytes, uint256 _start) internal pure returns (uint256) {
        require(_bytes.length >= (_start + 32), "Read out of bounds");
        uint256 tempUint;

        assembly {
            tempUint := mload(add(add(_bytes, 0x20), _start))
        }

        return tempUint;
    }

    function isListed(uint256 _tokenId) public view returns (bool) {
        return orderOfId[_tokenId].seller != address(0);
    }

    function onERC721Received(address operator,address from,uint256 tokenId,bytes calldata data) external returns(bytes4) {
        uint256 price = toUint256(data, 0);
        require(price > 0, "price must be greater than 0");
        require(!isListed(tokenId), "must not listed");
        orderOfId[tokenId] = Order(from, tokenId, price);
        if (sellerTokenLegth[from] != 0) sellerTokenLegth[from]++;
        else sellerTokenLegth[from]= 1;
        keys.push(tokenId);
        emit NewOrder(from, tokenId, price);
        return MAGIC_ON_ERC721_RECEIVED;
    }

    function removeOrder(uint256 _tokenId, address owner) internal{
        bool flag = false;
        for (uint256 i = 0; i < keys.length; i++) {
            if (keys[i] == _tokenId) {
                keys[i] = keys[keys.length-1];
                flag = true;
                break;
            }
        }
        if (flag) sellerTokenLegth[owner]--;
        delete keys[keys.length-1];
        delete orderOfId[_tokenId];
    }

    function getOrderLength() external view returns(uint256) {
        return keys.length;
    }

    function getAllNFTs() external view returns(Order[] memory) {
        Order[] memory temp = new Order[](keys.length);
        for (uint256 i = 0; i < keys.length; i++) {
            temp[i] = orderOfId[keys[i]];
        }
        return temp;
    }

    function getMyNFTS() external view returns(Order[] memory) {
        Order[] memory temp = new Order[](sellerTokenLegth[msg.sender]);
        uint cnt = 0;
        for (uint256 i = 0; i < keys.length; i++) {
            if (orderOfId[keys[i]].seller == msg.sender) {
                temp[cnt++] = orderOfId[keys[i]];
            }
        }
        return temp;
    }
}