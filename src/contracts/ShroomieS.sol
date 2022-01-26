// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.8.0;
pragma abicoder v2;

import "./ERC721.sol";

contract ShroomieS is ERC721 {
    string public collectionName;
    string public collectionNameSymbol;
    uint256 public shroomYCounter;
    uint256 public mintPrice;
    address payable owner;

    struct ShroomY {
        uint256 tokenId;
        string tokenName;
        string tokenURI;
        address payable mintedBy;
        address payable currentOwner;
        address payable previousOwner;
        uint256 price;
        uint256 numberOfTransfers;
        bool forSale;
    }

    mapping(uint256 => ShroomY) public allShroomieS;
    mapping(string => bool) public tokenNameExists;
    mapping(string => bool) public tokenURIExists;

    constructor() ERC721("Shroomy Collection", "SCOL") {
        collectionName = name();
        collectionNameSymbol = symbol();
        mintPrice = 0.01 * 1000000000000000000;
        owner = msg.sender;
    }

    function mintShroomY(
        string memory _name,
        string memory _tokenURI,
        uint256 _price
    ) public payable {
        require(msg.sender != address(0));
        shroomYCounter++;
        require(!_exists(shroomYCounter));

        require(!tokenURIExists[_tokenURI]);
        require(!tokenNameExists[_name]);

        _mint(msg.sender, shroomYCounter);
        _setTokenURI(shroomYCounter, _tokenURI);

        tokenURIExists[_tokenURI] = true;
        tokenNameExists[_name] = true;

        address payable sendTo = owner;
        sendTo.transfer(msg.value);

        ShroomY memory newShroomY = ShroomY(
            shroomYCounter,
            _name,
            _tokenURI,
            msg.sender,
            msg.sender,
            address(0),
            _price,
            0,
            false
        );
        allShroomieS[shroomYCounter] = newShroomY;
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

    function getTokenOwner(uint256 _tokenId) public view returns (address) {
        address _tokenOwner = ownerOf(_tokenId);
        return _tokenOwner;
    }

    function getTokenMetaData(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        string memory tokenMetaData = tokenURI(_tokenId);
        return tokenMetaData;
    }

    function getNumberOfTokensMinted() public view returns (uint256) {
        uint256 totalNumberOfTokensMinted = totalSupply();
        return totalNumberOfTokensMinted;
    }

    function getTotalNumberOfTokensOwnedByAnAddress(address _owner)
        public
        view
        returns (uint256)
    {
        uint256 totalNumberOfTokensOwned = balanceOf(_owner);
        return totalNumberOfTokensOwned;
    }

    function getTokenExists(uint256 _tokenId) public view returns (bool) {
        bool tokenExists = _exists(_tokenId);
        return tokenExists;
    }

    function buyToken(uint256 _tokenId) public payable {
        require(msg.sender != address(0));
        require(_exists(_tokenId));
        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner != address(0));
        require(tokenOwner != msg.sender);
        ShroomY memory shroomy = allShroomieS[_tokenId];
        require(msg.value >= shroomy.price);
        require(shroomy.forSale);
        _transfer(tokenOwner, msg.sender, _tokenId);
        address payable sendTo = shroomy.currentOwner;
        sendTo.transfer(msg.value);
        shroomy.previousOwner = shroomy.currentOwner;
        shroomy.currentOwner = msg.sender;
        shroomy.numberOfTransfers += 1;
        allShroomieS[_tokenId] = shroomy;
    }

    function giftToken(uint256 _tokenId, address payable _receiver) public payable {
        require(msg.sender != address(0));
        require(_exists(_tokenId));
        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner != address(0));
        require(tokenOwner == msg.sender);
        ShroomY memory shroomy = allShroomieS[_tokenId];

        _transfer(tokenOwner, _receiver, _tokenId);

        shroomy.previousOwner = shroomy.currentOwner;
        shroomy.currentOwner = _receiver;
        shroomy.numberOfTransfers += 1;
        allShroomieS[_tokenId] = shroomy;
    }

    function changeTokenPrice(uint256 _tokenId, uint256 _newPrice) public {
        require(msg.sender != address(0));
        require(_exists(_tokenId));
        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner == msg.sender);
        ShroomY memory shroomy = allShroomieS[_tokenId];
        shroomy.price = _newPrice;
        allShroomieS[_tokenId] = shroomy;
    }

    function toggleForSale(uint256 _tokenId) public {
        require(msg.sender != address(0));
        require(_exists(_tokenId));
        address tokenOwner = ownerOf(_tokenId);
        require(tokenOwner == msg.sender);
        ShroomY memory shroomy = allShroomieS[_tokenId];
        if (shroomy.forSale) {
            shroomy.forSale = false;
        } else {
            shroomy.forSale = true;
        }
        allShroomieS[_tokenId] = shroomy;
    }
}