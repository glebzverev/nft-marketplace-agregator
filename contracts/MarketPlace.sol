// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MultiAccess.sol";

contract MarketPlace is Ownable {

    address public multiAccess; 

    constructor(address _multiAccess){
        multiAccess = _multiAccess;
    }

    function transferToken(uint256 id, address _beneficiary) public onlyOwner{
        MultiAccess(multiAccess).transferToken(id, _beneficiary);
    }
}