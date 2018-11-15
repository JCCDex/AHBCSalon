pragma solidity ^0.4.25;

import "./SalonTokenStorage.sol";
import "./LibSafeMath.sol";

contract SalonTokenImpl is Administrative {
    using SafeMath for uint256;
    SalonTokenStorage tokenStorage;

    constructor(address storageAddr) public {
        tokenStorage = SalonTokenStorage(storageAddr);
    }

    function name() public view onlyPrivileged returns (string) {
        return tokenStorage.getName();
    }

    function symbol() public view onlyPrivileged returns (string) {
        return tokenStorage.getSymbol();
    }

    function decimals() public view onlyPrivileged returns (uint8) {
        return tokenStorage.getDecimals();
    }

    function totalSupply() external view onlyPrivileged returns (uint256) {
        return tokenStorage.getTotalSupply();
    }

    function balanceOf(address who) external view onlyPrivileged returns (uint256) {
        return tokenStorage.getBalances(who);
    }

    function allowance(address owner, address spender) external view onlyPrivileged returns (uint256) {
        return tokenStorage.getAllowed(owner, spender);
    }

    function transfer(address from, address to, uint256 value) external onlyPrivileged returns (bool) {
        _transfer(from, to, value);
        return true;
    }

    function approve(address approver, address spender, uint256 value) external onlyPrivileged returns (bool) {
        require(spender != address(0));

        tokenStorage.setAllowed(approver, spender, value);
        emit Approval(approver, spender, value);
        return true;
    }

    function transferFrom(address from, address spender, address to, uint256 value) external onlyPrivileged returns (bool) {
        tokenStorage.setAllowed(from, spender, tokenStorage.getAllowed(from, spender).sub(value));
        _transfer(from, to, value);
        return true;
    }

    function increaseAllowance(address approver, address spender, uint256 addedValue) external onlyPrivileged returns (bool) {
        require(spender != address(0));

        tokenStorage.setAllowed(approver, spender, tokenStorage.getAllowed(approver, spender).add(addedValue));
        emit Approval(approver, spender, tokenStorage.getAllowed(approver, spender));
        return true;
    }

    function decreaseAllowance(address approver, address spender, uint256 subtractedValue) external onlyPrivileged returns (bool) {
        require(spender != address(0));

        tokenStorage.setAllowed(approver, spender, tokenStorage.getAllowed(approver, spender).sub(subtractedValue));
        emit Approval(approver, spender, tokenStorage.getAllowed(approver, spender));
        return true;
    }

    function mint(address account, uint256 value) external onlyPrivileged returns (bool) {
        require(account != address(0));

        tokenStorage.setTotalSupply(tokenStorage.getTotalSupply().add(value));
        tokenStorage.setBalances(account, tokenStorage.getBalances(account).add(value));
        emit Mint(account, value);
        emit Transfer(address(0), account, value);
        return true;
    }

    function burn(address account, uint256 value) external onlyPrivileged returns (bool) {
        require(account != address(0));

        tokenStorage.setTotalSupply(tokenStorage.getTotalSupply().sub(value));
        tokenStorage.setBalances(account, tokenStorage.getBalances(account).sub(value));
        emit Burn(account, value);
        return true;
    }

    function _transfer(address from, address to, uint256 value) internal onlyPrivileged {
        require(to != address(0));

        tokenStorage.setBalances(from, tokenStorage.getBalances(from).sub(value));
        tokenStorage.setBalances(to, tokenStorage.getBalances(to).add(value));
        emit Transfer(from, to, value);
    }
}
