// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Test {
    function example(uint calldata x) external pure returns (uint) {
        x = 10;
        return msg.data;
    }
}