// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract cUSDT is ERC20 {
    constructor()
        ERC20("fake ustd in cbi", "cUSDT")
    {
        _mint(msg.sender, 1e8*1e18);
    }
}