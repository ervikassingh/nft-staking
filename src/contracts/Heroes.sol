// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./ERC1155.sol";

contract Heroes is ERC1155 {
    string public collectionName;
    string public collectionNameSymbol;
    uint256 public heroCounter;
    uint256 public userCounter;
    uint256 public mintPrice;
    address payable owner;

    struct Hero {
        uint256 tokenId;
        string tokenName;
        string tokenURI;
    }

    struct User {
        address userAddress;
        mapping(uint256 => uint256) sales; // no. of heroes for sale to id
        mapping(uint256 => uint256) salePrice; // price for each hero id
        mapping(uint256 => uint256) stakes; // no. of heroes for stake to id
    }

    mapping(uint256 => Hero) public allHeroes;
    mapping(uint256 => User) public allUsers;
    mapping(address => bool) public userExists;
    mapping(string => bool) public tokenNameExists;
    mapping(string => bool) public tokenURIExists;

    mapping(address => uint) public timestamps;
    mapping(address => uint) public rewards;

    constructor() public ERC1155("HeroCollection") {
        collectionName = "Hero Collection";
        collectionNameSymbol = "HCOL";
        mintPrice = 0.05 * 1000000000000000000;
        owner = msg.sender;
    }

    function mintHero(
        // string memory _id,
        string memory _name,
        string memory _tokenURI
    ) public payable {
        require(msg.sender != address(0));

        if (!userExists[msg.sender]) {
            createUser(msg.sender);
        }

        if (tokenNameExists[_name]) {
            uint256 i = 1;
            Hero memory hero = allHeroes[i];
            for (i = 1; i <= heroCounter; i++) {
                hero = allHeroes[i];
                if (
                    keccak256(abi.encodePacked(hero.tokenName)) ==
                    keccak256(abi.encodePacked(_name))
                ) {
                    break;
                }
            }
            require(
                keccak256(abi.encodePacked(hero.tokenURI)) ==
                    keccak256(abi.encodePacked(_tokenURI))
            );
            bytes memory data;
            _mint(msg.sender, heroCounter, 1, data);
        } else {
            heroCounter++;
            require(!tokenURIExists[_tokenURI]);
            bytes memory data;
            _mint(msg.sender, heroCounter, 1, data);

            tokenURIExists[_tokenURI] = true;
            tokenNameExists[_name] = true;

            Hero memory newHero = Hero(heroCounter, _name, _tokenURI);
            allHeroes[heroCounter] = newHero;
        }

        // address payable sendTo = owner;
        // sendTo.transfer(msg.value);
    }

    function createUser(address _user) public {
        userCounter++;
        User storage newUser = allUsers[userCounter];
        newUser.userAddress = _user;

        allUsers[userCounter].userAddress = newUser.userAddress;
        uint256 i = 1;

        for (i = 1; i <= heroCounter; i++) {
            allUsers[userCounter].salePrice[i] = newUser.salePrice[i];
            allUsers[userCounter].sales[i] = newUser.sales[i];
            allUsers[userCounter].stakes[i] = newUser.stakes[i];
        }

        userExists[_user] = true;
    }

    function getSales(address _userAddress, uint256 _id)
        public
        view
        returns (uint256)
    {
        uint256 i = 1;
        User storage user = allUsers[i];
        for (i = 1; i <= userCounter; i++) {
            user = allUsers[i];
            if (
                keccak256(abi.encodePacked(user.userAddress)) ==
                keccak256(abi.encodePacked(_userAddress))
            ) {
                return user.sales[_id];
            }
        }
        return 0;
    }

    function getStakes(address _userAddress, uint256 _id)
        public
        view
        returns (uint256)
    {
        uint256 i = 1;
        User storage user = allUsers[i];
        for (i = 1; i <= userCounter; i++) {
            user = allUsers[i];
            if (
                keccak256(abi.encodePacked(user.userAddress)) ==
                keccak256(abi.encodePacked(_userAddress))
            ) {
                return user.stakes[_id];
            }
        }
        return 0;
    }

    function getSalePrice(address _userAddress, uint256 _id)
        public
        view
        returns (uint256)
    {
        uint256 i = 1;
        User storage user = allUsers[i];
        for (i = 1; i <= userCounter; i++) {
            user = allUsers[i];
            if (
                keccak256(abi.encodePacked(user.userAddress)) ==
                keccak256(abi.encodePacked(_userAddress))
            ) {
                return user.salePrice[_id];
            }
        }
        return 0;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getMintPrice() public view returns (uint256) {
        return mintPrice;
    }

    function setMintPrice(uint256 _price) public returns (bool) {
        require(owner == msg.sender);
        mintPrice = _price;
        return true;
    }

    function getUserId(address _address) public view returns (uint256) {
        for (uint256 i = 1; i <= userCounter; i++) {
            if (allUsers[i].userAddress == _address) {
                return i;
            }
        }
    }

    function transferToken(
        uint256 _tokenId,
        uint256 _amount,
        address _to
    ) public payable {
        uint256 balance = balanceOf(msg.sender, _tokenId);
        uint256 _userId = getUserId(msg.sender);
        User storage user = allUsers[_userId];
        uint256 totalSet = user.sales[_tokenId] + user.stakes[_tokenId];
        require(balance - totalSet >= _amount);
        bytes memory data;
        safeTransferFrom(msg.sender, _to, _tokenId, _amount, data);
        if (!userExists[_to]) {
            createUser(_to);
        }
    }

    function buyToken(
        uint256 _tokenId,
        uint256 _amount,
        address _from,
        address _to
    ) public payable {
        require(_to != address(0));
        require(_from != address(0));
        require(_from != _to);

        uint256 _userId = getUserId(_from);
        User storage user = allUsers[_userId];
        require(user.sales[_tokenId] >= _amount);
        bytes memory data;
        safeTransferFrom(_from, _to, _tokenId, _amount, data);
        user.sales[_tokenId] = user.sales[_tokenId] - _amount;

        allUsers[_userId].userAddress = user.userAddress;
        uint256 i = 1;

        for (i = 1; i <= heroCounter; i++) {
            allUsers[_userId].salePrice[i] = user.salePrice[i];
            allUsers[_userId].sales[i] = user.sales[i];
            allUsers[_userId].stakes[i] = user.stakes[i];
        }

        if (!userExists[_to]) {
            createUser(_to);
        }
    }

    function toggleForSale(
        uint256 _tokenId,
        uint256 _amount,
        bool _toggle,
        address _saleContAddress
    ) public {
        uint256 _userId = getUserId(msg.sender);
        User storage user = allUsers[_userId];
        uint256 bal = balanceOf(msg.sender, _tokenId);
        require(bal >= _amount);
        if (_toggle) {
            require(
                bal - (user.stakes[_tokenId] + user.sales[_tokenId]) >= _amount
            );
            user.sales[_tokenId] = user.sales[_tokenId] + _amount;

            allUsers[_userId].userAddress = user.userAddress;
            uint256 i = 1;

            for (i = 1; i <= heroCounter; i++) {
                allUsers[_userId].salePrice[i] = user.salePrice[i];
                allUsers[_userId].sales[i] = user.sales[i];
                allUsers[_userId].stakes[i] = user.stakes[i];
            }
        } else {
            require(user.sales[_tokenId] >= _amount);
            user.sales[_tokenId] = user.sales[_tokenId] - _amount;

            allUsers[_userId].userAddress = user.userAddress;
            uint256 i = 1;

            for (i = 1; i <= heroCounter; i++) {
                allUsers[_userId].salePrice[i] = user.salePrice[i];
                allUsers[_userId].sales[i] = user.sales[i];
                allUsers[_userId].stakes[i] = user.stakes[i];
            }
        }
        setApprovalForAll(_saleContAddress, true);
    }

    function toggleForStake(
        uint256 _tokenId,
        uint256 _amount,
        bool _toggle,
        uint256 _time,
        uint256 _reward
    ) public {
        uint256 _userId = getUserId(msg.sender);
        User storage user = allUsers[_userId];
        uint256 bal = balanceOf(msg.sender, _tokenId);
        require(bal >= _amount);

        require(_time > timestamps[msg.sender]);
        timestamps[msg.sender] = _time;
        rewards[msg.sender] = rewards[msg.sender] + (_reward * user.stakes[_tokenId]);

        if (_toggle) {
            require(
                bal - (user.stakes[_tokenId] + user.sales[_tokenId]) >= _amount
            );
            user.stakes[_tokenId] = user.stakes[_tokenId] + _amount;

            allUsers[_userId].userAddress = user.userAddress;
            uint256 i = 1;

            for (i = 1; i <= heroCounter; i++) {
                allUsers[_userId].salePrice[i] = user.salePrice[i];
                allUsers[_userId].sales[i] = user.sales[i];
                allUsers[_userId].stakes[i] = user.stakes[i];
            }
        } else {
            require(user.stakes[_tokenId] >= _amount);
            user.stakes[_tokenId] = user.stakes[_tokenId] - _amount;

            allUsers[_userId].userAddress = user.userAddress;
            uint256 i = 1;

            for (i = 1; i <= heroCounter; i++) {
                allUsers[_userId].salePrice[i] = user.salePrice[i];
                allUsers[_userId].sales[i] = user.sales[i];
                allUsers[_userId].stakes[i] = user.stakes[i];
            }
        }
    }

    function setPrice(uint256 _tokenId, uint256 _price) public {
        uint256 _userId = getUserId(msg.sender);
        User storage user = allUsers[_userId];
        user.salePrice[_tokenId] = _price;
        allUsers[_userId].userAddress = user.userAddress;
        uint256 i = 1;

        for (i = 1; i <= heroCounter; i++) {
            allUsers[_userId].salePrice[i] = user.salePrice[i];
            allUsers[_userId].sales[i] = user.sales[i];
            allUsers[_userId].stakes[i] = user.stakes[i];
        }
    }
}
