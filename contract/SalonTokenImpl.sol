pragma solidity ^0.4.25;

import "./SalonTokenStorage.sol";
import "./LibSafeMath.sol";

contract SalonTokenImpl {
    using SafeMath for uint256;
    SalonTokenStorage tokenStorage;

    function transfer(address to, uint256 value) external {
        _transfer(msg.sender, to, value);
    }

    function approve(address spender, uint256 value) external {
        require(spender != address(0));

        tokenStorage.setAllowed(msg.sender, spender, value);
    }

    function transferFrom(address from, address to, uint256 value) external {
        tokenStorage.setAllowed(from, msg.sender, tokenStorage.getAllowed(from, msg.sender).sub(value));
        _transfer(from, to, value);
    }

    function increaseAllowance(address spender, uint256 addedValue) external {
        require(spender != address(0));

        tokenStorage.setAllowed(msg.sender, spender, tokenStorage.getAllowed(msg.sender, spender).add(addedValue));
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external {
        require(spender != address(0));

        tokenStorage.setAllowed(msg.sender, spender, tokenStorage.getAllowed(msg.sender, spender).sub(subtractedValue));
    }

    function mint(address account, uint256 value) external {
        require(account != address(0));

        tokenStorage.setTotalSupply(tokenStorage.getTotalSupply().add(value));
        tokenStorage.setBalances(account, tokenStorage.getBalances(account).add(value));
    }

    function burn(address account, uint256 value) external {
        require(account != address(0));

        tokenStorage.setTotalSupply(tokenStorage.getTotalSupply().sub(value));
        tokenStorage.setBalances(account, tokenStorage.getBalances(account).sub(value));
    }

    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0));

        tokenStorage.setBalances(from, tokenStorage.getBalances(from).sub(value));
        tokenStorage.setBalances(to, tokenStorage.getBalances(to).add(value));
    }
}
