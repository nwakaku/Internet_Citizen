// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, ERC721URIStorage, ERC721Burnable {
        using Counters for Counters.Counter;
        Counters.Counter private _tokenIds;

    //The structure to store info about a listed token
    struct ListedToken {
        uint tokenId;
        address payable Company_owner;
        address payable candidate;
    }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
        address Company_owner,
        address candidate
    );


    //maps tokenID to token info
    mapping (uint => ListedToken) company;

    constructor() ERC721("Internet_Citizen", "IC") {}

    function mintNFT(address recipient, string memory _tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        //mint the NFT to the candidates wallet address
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        createListedToken(newItemId, recipient);

        return newItemId;
    }

    function createListedToken(uint tokenId, address recipient) private {
        company[tokenId] = ListedToken(
            tokenId,
            payable(msg.sender),
            payable(recipient)
        );

        _transfer(msg.sender, recipient, tokenId);
        //Emit the event for successful transfer.The frontend parse this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            msg.sender,
            recipient
        );
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete company[tokenId];
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // function burnNFT(uint tokenId) public {
    //     // Burn NFT
    //     _burn(tokenId); 
    //     delete company[tokenId];
    // }

    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(company[i+1].candidate == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(company[i+1].candidate == msg.sender) {
                uint currentId = i+1;
                ListedToken storage currentItem = company[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function getNFTCompany() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        //Important to get a count of all the NFTs thaat belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(company[i+1].Company_owner == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(company[i+1].Company_owner == msg.sender) {
                uint currentId = i+1;
                ListedToken storage currentItem = company[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }


}