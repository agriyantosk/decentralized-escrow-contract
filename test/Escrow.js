const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Escrow", function () {
    let Escrow;
    let escrow;
    let owner;
    let beneficiary;
    let arbiter;

    this.beforeAll(async function () {
        [owner, beneficiary, arbiter] = await ethers.getSigners();
        Escrow = await ethers.getContractFactory("Escrow");
        const depositedBalance = ethers.parseEther("1.0");
        escrow = await Escrow.connect(owner).deploy(
            arbiter.address,
            beneficiary.address,
            { value: depositedBalance }
        );
        console.log(`contract deployed to this address: ${escrow.target}`);
    });

    it("Should set the correct initial values", async function () {
        expect(await escrow.arbiter()).to.equal(arbiter.address);
        expect(await escrow.beneficiary()).to.equal(beneficiary.address);
        expect(await escrow.depositor()).to.equal(owner.address);
        expect(await escrow.isApproved()).to.equal(false);
    });

    it("Should approve and transfer funds to beneficiary", async function () {
        const contractBalance = await ethers.provider.getBalance(escrow.target);
        const initialBeneficiaryBalance = await ethers.provider.getBalance(
            beneficiary.address
        );

        await escrow.connect(arbiter).approve();

        const finalBeneficiaryBalance = await ethers.provider.getBalance(
            beneficiary.address
        );
        expect(finalBeneficiaryBalance - initialBeneficiaryBalance).to.equal(
            contractBalance
        );
        expect(await escrow.isApproved()).to.equal(true);
    });

    it("Should revert if non-arbiter tries to approve", async function () {
        await expect(
            escrow.connect(beneficiary).approve(),
            "Only the arbiter can approve this transaction!"
        );
    });

    it("Should revert if approve is called twice", async function () {
        await expect(
            escrow.connect(arbiter).approve(),
            "This contract can only be approved once!"
        );
    });
});