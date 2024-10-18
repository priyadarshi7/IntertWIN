// contracts/Marketplace.sol
pragma solidity ^0.8.0;

contract Marketplace {
    struct Project {
        uint id;
        address payable owner;
        string title;
        string description;
        uint price;
        bool sold;
    }

    mapping(uint => Project) public projects;
    uint public projectCount;

    event ProjectCreated(uint id, string title, uint price, address owner);
    event ProjectPurchased(uint id, address buyer);

    function createProject(string memory _title, string memory _description, uint _price) public {
        projectCount++;
        projects[projectCount] = Project(projectCount, payable(msg.sender), _title, _description, _price, false);
        emit ProjectCreated(projectCount, _title, _price, msg.sender);
    }

    function purchaseProject(uint _id) public payable {
        Project memory _project = projects[_id];
        require(_project.price == msg.value, "Incorrect Ether value");
        require(!_project.sold, "Project already sold");

        _project.owner.transfer(msg.value);
        _project.sold = true;
        projects[_id] = _project;

        emit ProjectPurchased(_id, msg.sender);
    }
}
