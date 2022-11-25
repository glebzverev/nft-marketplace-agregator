// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiAccess is Ownable {
    mapping (address => bool) public whiteList;
    ERC721 public NFT;

    constructor(address _nft){
        NFT = ERC721(_nft);
    }
    
    function addWhitelist(address _mp) public onlyOwner{
        whiteList[_mp] = true;
    }

    function transferToken(uint256 id, address _beneficiary) public {
        require(whiteList[msg.sender], "You are not Whitelist marketplace");
        NFT.safeTransferFrom(NFT.ownerOf(id), _beneficiary, id, bytes("0x"));
    }
}