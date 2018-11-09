pragma solidity ^0.4.25;

import "./Administrative.sol";
import "./IExtendedERC20.sol";
import "./IUpgradeable.sol";
import "./SalonTokenImpl.sol";

contract SalonToken is IExtendedERC20, IUpgradeable, Administrative {
    SalonTokenImpl public tokenImpl;


    modifier onlyPayloadSize(uint size) {
        require(msg.data.length >= size + 4);
        _;
    }

    constructor(string name, string symbol, uint8 decimals) public {
        tokenImpl = new SalonTokenImpl(name, symbol, decimals);
    }

    function name() public view returns (string) {
        return tokenImpl.name();
    }

    function symbol() public view returns (string) {
        return tokenImpl.symbol();
    }

    function decimals() public view returns (uint8) {
        return tokenImpl.decimals();
    }

    function totalSupply() external view returns (uint256) {
        return tokenImpl.totalSupply();
    }

    function balanceOf(address who) external view returns (uint256) {
        return tokenImpl.balanceOf(who);
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return tokenImpl.allowance(owner, spender);
    }

    function transfer(address to, uint256 value) external onlyPayloadSize(2 * 32) returns (bool) {
        return tokenImpl.transfer(to, value);
    }

    function approve(address spender, uint256 value) external onlyPayloadSize(2 * 32) returns (bool) {
        return tokenImpl.approve(spender, value);
    }

    function transferFrom(address from, address to, uint256 value) external onlyPayloadSize(3 * 32) returns (bool) {
        return tokenImpl.transferFrom(from, to, value);
    }

    function increaseAllowance(address spender, uint256 addedValue) external onlyPayloadSize(2 * 32) returns (bool) {
        return tokenImpl.increaseAllowance(spender, addedValue);
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external onlyPayloadSize(2 * 32) returns (bool) {
        return tokenImpl.decreaseAllowance(spender, subtractedValue);
    }

    function mint(address account, uint256 value) external onlyPrivileged returns (bool) {
        return tokenImpl.mint(account, value);
    }

    function burn(address account, uint256 value) external onlyPrivileged returns (bool) {
        return tokenImpl.burn(account, value);
    }

    function upgrade(address newImpl) external onlyPrivileged {
        address temp = tokenImpl;
        tokenImpl = SalonTokenImpl(newImpl);
        emit Upgrade(newImpl, temp);
    }
}
