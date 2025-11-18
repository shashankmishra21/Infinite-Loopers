// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCredit is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    struct Certificate {
        uint256 tokenId;
        address farmer;
        string farmId;
        uint256 carbonTons;
        uint256 issuedAt;
        string ipfsHash;
        bool isRetired;
    }
    
    mapping(uint256 => Certificate) public certificates;
    mapping(string => uint256) public farmToToken;
    
    event CertificateIssued(
        uint256 indexed tokenId,
        address indexed farmer,
        string farmId,
        uint256 carbonTons,
        string ipfsHash
    );
    
    event CertificateRetired(uint256 indexed tokenId, address indexed by);
    
    constructor() ERC721("CarbonSetu Certificate", "CSC") Ownable(msg.sender) {}
    
    function issueCertificate(
        address farmer,
        string memory farmId,
        uint256 carbonTons,
        string memory ipfsHash
    ) public onlyOwner returns (uint256) {
        require(farmToToken[farmId] == 0, "Certificate already issued");
        require(farmer != address(0), "Invalid farmer address");
        require(carbonTons > 0, "Carbon tons must be positive");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(farmer, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked("ipfs://", ipfsHash)));
        
        certificates[tokenId] = Certificate({
            tokenId: tokenId,
            farmer: farmer,
            farmId: farmId,
            carbonTons: carbonTons,
            issuedAt: block.timestamp,
            ipfsHash: ipfsHash,
            isRetired: false
        });
        
        farmToToken[farmId] = tokenId;
        
        emit CertificateIssued(tokenId, farmer, farmId, carbonTons, ipfsHash);
        
        return tokenId;
    }
    
    function retireCertificate(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!certificates[tokenId].isRetired, "Already retired");
        
        certificates[tokenId].isRetired = true;
        
        emit CertificateRetired(tokenId, msg.sender);
    }
    
    function getCertificate(uint256 tokenId) public view returns (Certificate memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return certificates[tokenId];
    }
    
    function totalCertificates() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
