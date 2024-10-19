// blockchain/contracts/Marketplace.sol

pragma solidity ^0.8.0;

contract Marketplace {
    struct Project {
        uint id;
        string title;
        string description;
        uint price;
        address payable owner;
    }

    mapping(uint => Project) public projects;
    uint public projectCount;

    function createProject(string memory _title, string memory _description, uint _price) public {
        projectCount++;
        projects[projectCount] = Project(projectCount, _title, _description, _price, payable(msg.sender));
    }

    function purchaseProject(uint _id) public payable {
        Project memory _project = projects[_id];
        require(msg.value >= _project.price, "Not enough Ether sent");
        require(_project.owner != msg.sender, "Owner cannot buy their own project");
        _project.owner.transfer(msg.value);
        projects[_id].owner = payable(msg.sender);
    }
}
