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
        return tokenStorage.totalSupply();
    }

    function balanceOf(address who) external view returns (uint256) {
        return tokenStorage.balanceOf(who);
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return tokenStorage.allowance(owner, spender);
    }

    function transfer(address to, uint256 value) external onlyPayloadSize(2 * 32) returns (bool) {
        bytes4 methodId = bytes4(keccak256("transfer(address,uint256)"));
        return salonTokenImpl.delegatecall(methodId, to, value);
    }

    function approve(address spender, uint256 value) external onlyPayloadSize(2 * 32) returns (bool) {
        bytes4 methodId = bytes4(keccak256("approve(address,uint256)"));
        return salonTokenImpl.delegatecall(methodId, spender, value);
    }

    function transferFrom(address from, address to, uint256 value) external onlyPayloadSize(3 * 32) returns (bool) {
        bytes4 methodId = bytes4(keccak256("transferFrom(address,address,uint256)"));
        return salonTokenImpl.delegatecall(methodId, from, to, value);
    }

    function increaseAllowance(address spender, uint256 addedValue) external onlyPayloadSize(2 * 32) returns (bool) {
        bytes4 methodId = bytes4(keccak256("increaseAllowance(address,uint256)"));
        return salonTokenImpl.delegatecall(methodId, spender, addedValue);
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external onlyPayloadSize(2 * 32) returns (bool) {
        bytes4 methodId = bytes4(keccak256("decreaseAllowance(address,uint256)"));
        return salonTokenImpl.delegatecall(methodId, spender, subtractedValue);
    }

    function mint(address account, uint256 value) external onlyPrivileged returns (bool) {
        bytes4 methodId = bytes4(keccak256("mint(address,uint256)"));
        return salonTokenImpl.delegatecall(methodId, account, value);
    }

    function burn(address account, uint256 value) external onlyPrivileged returns (bool) {
        bytes4 methodId = bytes4(keccak256("burn(address,uint256)"));
        return salonTokenImpl.delegatecall(methodId, account, value);
    }

    function upgrade(address newImpl) external onlyPrivileged {
        salonTokenImpl = newImpl;
    }
}
