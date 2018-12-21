pragma solidity ^0.4.25;

contract Administrative {
    address public owner;
    address public administrator;

    constructor() public {
        owner = msg.sender;
        administrator = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyPrivileged() {
        require((msg.sender == owner) || (msg.sender == administrator));
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }

    function transferAdministrator(address newAdministrator) public onlyPrivileged {
        if (newAdministrator != address(0)) {
            administrator = newAdministrator;
        }
    }

}