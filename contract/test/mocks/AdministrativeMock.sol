pragma solidity ^0.5.0;

import "../../contracts/salon/Administrative.sol";

/**
 * @dev This is an example contract implementation of Administrative.
 */
contract AdministrativeMock is
  Administrative
{
  function transferOwnership(address newOwner) public {
      // if (newOwner != address(0)) {
          owner = newOwner;
      // }
  }
  // function transferOwnership(address _newOwner) public {
  //   return super.transferOwnership(_newOwner);
  // }

  // function transferAdministrator(address _newAdministrator) public onlyPrivileged {
  //   return super.transferAdministrator(_newAdministrator);
  // }
}
