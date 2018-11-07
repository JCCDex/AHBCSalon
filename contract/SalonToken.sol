pragma solidity ^0.4.25;

import "./Administrative.sol";
import "./IExtendedERC20.sol";

contract SalonToken is IExtendedERC20, Administrative {
    IExtendedERC20 salonTokenImpl;

    function mint(address account, uint256 value) public onlyPrivileged {
        _mint(account, value);
    }

    function burn(address account, uint256 value) public onlyPrivileged {
        _burn(account, value);
    }
}
