pragma solidity ^0.4.25;

interface IUpgradeable {
    function upgrade(address newImpl) external;

    event Upgrade(
        address indexed newAddress,
        address indexed oldAddress
    );
}
