// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Project {
        uint256 id;
        string title;
        string description;
        uint256 price;
        address payable owner;
        bool purchased;
    }

    mapping(uint256 => Project) public projects;
    uint256 public projectCount;

    event ProjectCreated(
        uint256 id,
        string title,
        string description,
        uint256 price,
        address owner
    );

    event ProjectPurchased(
        uint256 id,
        address buyer,
        uint256 value
    );

    function createProject(string memory _title, string memory _description, uint256 _price) public {
        require(bytes(_title).length > 0, "Project title is required");
        require(bytes(_description).length > 0, "Project description is required");
        require(_price >= 0, "Project price must be non-negative");

        projectCount++;
        projects[projectCount] = Project(projectCount, _title, _description, _price, payable(msg.sender), false);
        
        emit ProjectCreated(projectCount, _title, _description, _price, msg.sender);
    }

    function purchaseProject(uint256 _projectId) public payable {
        require(_projectId > 0 && _projectId <= projectCount, "Invalid project ID");
        Project storage project = projects[_projectId];
        
        require(!project.purchased, "Project already purchased");
        if (project.price > 0) {
            require(msg.value >= project.price, "Insufficient funds");
        }

        project.purchased = true;
        project.owner.transfer(msg.value); // Transfer funds to the project owner
        emit ProjectPurchased(_projectId, msg.sender, msg.value);
    }
}
