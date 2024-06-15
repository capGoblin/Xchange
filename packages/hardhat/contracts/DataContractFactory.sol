// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DataContract.sol";

contract DataContractFactory {
    DataContract[] public dataContracts;
    mapping(address => DataContract[]) public ownerToContracts;

    event DataContractCreated(address dataContractAddress, string name, string description, address owner);

    function createDataContract(
        string memory _name,
        string memory _description,
        string memory _dataUrl,
        uint256 _priceWei,
        string memory _createdAt,
        string memory _keywords,
        string memory _size
    ) public {
        DataContract newDataContract = new DataContract(
            _name,
            _description,
            _dataUrl,
            _priceWei,
            _createdAt,
            _keywords,
            _size
        );
        dataContracts.push(newDataContract);
        ownerToContracts[msg.sender].push(newDataContract);
        emit DataContractCreated(address(newDataContract), _name, _description, msg.sender);
    }

    function getDataContracts() public view returns (DataContract[] memory) {
        return dataContracts;
    }

    function getContractsByOwner(address owner) public view returns (DataContract[] memory) {
        return ownerToContracts[owner];
    }
}
