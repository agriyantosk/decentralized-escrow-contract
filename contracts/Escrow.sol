// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Escrow {
    address public arbiter;
    address public beneficiary;
    address public depositor;

    bool public isApproved;

    constructor(address _arbiter, address _beneficiary) payable {
        arbiter = _arbiter;
        beneficiary = _beneficiary;
        depositor = msg.sender;
    }

    event Approved(uint);

    function approve() external {
        require(!isApproved, "This contract can only be approved once!");
        require(
            msg.sender == arbiter,
            "Only the arbiter can approve this transaction!"
        );
        uint balance = address(this).balance;
        (bool sent, ) = payable(beneficiary).call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit Approved(balance);
        isApproved = true;
    }
}
