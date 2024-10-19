// contracts/Marketplace.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ProjectMarketplace is ERC721 {
    uint256 private _tokenIdCounter; // Simple counter

    struct Project {
        uint256 id;
        address payable seller;
        address payable owner;
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => Project) public projects;

    event ProjectListed(uint256 indexed id, address seller, uint256 price);
    event ProjectSold(uint256 indexed id, address buyer, uint256 price);

    constructor() ERC721("ProjectMarketplace", "PMT") {
        _tokenIdCounter = 0; // Initialize counter
    }

    function createProject(string memory tokenURI, uint256 price) public returns (uint256) {
        require(price > 0, "Price must be greater than zero");

        _tokenIdCounter++; // Increment the counter
        uint256 newProjectId = _tokenIdCounter;
        _mint(msg.sender, newProjectId);

        projects[newProjectId] = Project({
            id: newProjectId,
            seller: payable(msg.sender),
            owner: payable(address(0)),
            price: price,
            isListed: true
        });

        emit ProjectListed(newProjectId, msg.sender, price);
        return newProjectId;
    }

    function buyProject(uint256 projectId) public payable {
        Project storage project = projects[projectId];
        require(project.isListed, "Project not listed for sale");
        require(msg.value >= project.price, "Not enough funds to buy the project");

        project.owner = payable(msg.sender);
        project.seller.transfer(msg.value);
        project.isListed = false;

        emit ProjectSold(projectId, msg.sender, project.price);
    }

    function listProject(uint256 projectId, uint256 price) public {
        require(ownerOf(projectId) == msg.sender, "Only owner can list project");

        Project storage project = projects[projectId];
        project.price = price;
        project.isListed = true;

        emit ProjectListed(projectId, msg.sender, price);
    }
}
