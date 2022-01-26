// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;

import "./Heroes.sol";

contract HeroesSale {
    address owner;
    Heroes public heroesContract;

    constructor(Heroes _heroesContract) public {
        owner = msg.sender;
        heroesContract = _heroesContract;
    }

    function buyHero(uint256 _tokenId, uint256 _amount, address _from) public payable {
        heroesContract.buyToken(_tokenId, _amount, _from, msg.sender);
    }

    function giftHero(uint256 _tokenId, uint256 _amount, address _to) public payable {
        heroesContract.buyToken(_tokenId, _amount, msg.sender, _to);
    }
}
