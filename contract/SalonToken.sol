pragma solidity ^0.4.25;

import "./Administrative.sol";
import "./IExtendedERC20.sol";
import "./SalonTokenStorage.sol";
import "./IUpgradeable.sol";

contract SalonToken is IExtendedERC20, IUpgradeable, Administrative {
    SalonTokenStorage tokenStorage;
    address salonTokenImpl;

    modifier onlyPayloadSize(uint size) {
        require(msg.data.length >= size + 4);
        _;
    }

    constructor(string name, string symbol, uint8 decimals, address implAddr, address storageAddr) public {
        tokenStorage = SalonTokenStorage(storageAddr);
        salonTokenImpl = implAddr;
        tokenStorage.setName(name);
        tokenStorage.setSymbol(symbol);
        tokenStorage.setDecimals(decimals);
    }

    function totalSupply() external view returns (uint256) {
        return tokenStorage.getTotalSupply();
    }

    function balanceOf(address who) external view returns (uint256) {
        return tokenStorage.getBalances(who);
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return tokenStorage.getAllowed(owner, spender);
    }

    function transfer(address to, uint256 value) external onlyPayloadSize(2 * 32) returns (bool) {
        bytes4 methodId = bytes4(keccak256("transfer(address,uint256)"));
        bool success = salonTokenImpl.delegatecall(methodId, to, value);
        if(success) {
            emit Transfer(msg.sender, to, value);
        }
        return success;
    }

    function approve(address spender, uint256 value) external onlyPayloadSize(2 * 32) returns (bool) {
        bytes4 methodId = bytes4(keccak256("approve(address,uint256)"));
        bool success = salonTokenImpl.delegatecall(methodId, spender, value);
        if(success) {
            emit Approval(msg.sender, spender, value);
        }
        return success;
    }

    function transferFrom(address from, address to, uint256 value) external onlyPayloadSize(3 * 32) returns (bool) {
        bytes4 methodId = bytes4(keccak256("transferFrom(address,address,uint256)"));
        bool success = salonTokenImpl.delegatecall(methodId, from, to, value);
        if(success) {
            emit Transfer(from, to, value);
        }
        return success;
    }

    function increaseAllowance(address spender, uint256 addedValue) external onlyPayloadSize(2 * 32) returns (bool) {
        bytes4 methodId = bytes4(keccak256("increaseAllowance(address,uint256)"));
        bool success = salonTokenImpl.delegatecall(methodId, spender, addedValue);
        if(success) {
            emit Approval(msg.sender, spender, tokenStorage.getAllowed(msg.sender, spender));
        }
        return success;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external onlyPayloadSize(2 * 32) returns (bool) {
        bytes4 methodId = bytes4(keccak256("decreaseAllowance(address,uint256)"));
        bool success = salonTokenImpl.delegatecall(methodId, spender, subtractedValue);
        if(success) {
            emit Approval(msg.sender, spender, tokenStorage.getAllowed(msg.sender, spender));
        }
        return success;
    }

    function mint(address account, uint256 value) external onlyPrivileged returns (bool) {
        bytes4 methodId = bytes4(keccak256("mint(address,uint256)"));
        bool success = salonTokenImpl.delegatecall(methodId, account, value);
        if(success) {
            emit Mint(account, value);
            emit Transfer(address(0), account, value);
        }
        return success;
    }

    function burn(address account, uint256 value) external onlyPrivileged returns (bool) {
        bytes4 methodId = bytes4(keccak256("burn(address,uint256)"));
        bool success = salonTokenImpl.delegatecall(methodId, account, value);
        if(success) {
            emit Burn(account, value);
        }
        return success;
    }

    function upgrade(address newImpl) external onlyPrivileged {
        address temp = salonTokenImpl;
        salonTokenImpl = newImpl;
        emit Upgrade(newImpl, temp);
    }
}
