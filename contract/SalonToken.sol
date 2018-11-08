pragma solidity ^0.4.25;

import "./Administrative.sol";
import "./IExtendedERC20.sol";

contract SalonToken is IExtendedERC20, Administrative {
    IExtendedERC20 salonTokenImpl;

    modifier onlyPayloadSize(uint size) {
        require(msg.data.length >= size + 4);
        _;
    }

    constructor(string name, string symbol, uint8 decimals, address implAddr) public {
        salonTokenImpl = IExtendedERC20(implAddr);

    }

    function totalSupply() external view returns (uint256) {
        return salonTokenImpl.totalSupply();
    }

    function balanceOf(address who) external view returns (uint256) {
        return salonTokenImpl.balanceOf(who);
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return salonTokenImpl.allowance(owner, spender);
    }

    function transfer(address to, uint256 value) external onlyPayloadSize(2 * 32) returns (bool) {
        return salonTokenImpl.transfer(to, value);
    }

    function approve(address spender, uint256 value) external onlyPayloadSize(2 * 32) returns (bool) {
        return salonTokenImpl.approve(spender, value);
    }

    function transferFrom(address from, address to, uint256 value) external onlyPayloadSize(3 * 32) returns (bool) {
        return salonTokenImpl.transferFrom(from, to, value);
    }

    function increaseAllowance(address spender, uint256 addedValue) external onlyPayloadSize(2 * 32) returns (bool) {
        return salonTokenImpl.increaseAllowance(spender, addedValue);
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external onlyPayloadSize(2 * 32) returns (bool) {
        return salonTokenImpl.decreaseAllowance(spender, subtractedValue);
    }

    function mint(address account, uint256 value) external onlyPrivileged returns (bool) {
        return salonTokenImpl.mint(account, value);
    }

    function burn(address account, uint256 value) external onlyPrivileged returns (bool) {
        return salonTokenImpl.burn(account, value);
    }

    function upgrade(address newImpl) public onlyPrivileged {
        salonTokenImpl = IExtendedERC20(newImpl);
    }
}
