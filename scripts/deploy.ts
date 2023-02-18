import { ethers } from "hardhat";

type Memo = {
  name: string;
  message: string;
  timestamp: number;
  from: string;
};

async function getBalances(address: string) {
  const balanceBigInt = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

async function consoleBalances(addresses: string[]) {
  let counter = 0;
  for (const address of addresses) {
    console.log(`Address ${counter} balance:`, await getBalances(address));
    counter++;
  }
}

async function consoleMemos(memos: Memo[]) {
  for (const memo of memos) {
    console.log(
      `At ${memo.timestamp}, name ${memo.name}, address ${memo.from}, message ${memo.message}`
    );
  }
}

async function main() {
  const [owner, from1, from2, from3] = await ethers.getSigners();
  const chai = await ethers.getContractFactory("chai");
  const contract = await chai.deploy(); // instance of contract
  await contract.deployed();
  console.log("Address of contract", contract.address);

  const addresses = [owner.address, from1.address, from2.address, from3.address];
  console.log("before buying chai");
  await consoleBalances(addresses);

  const amount = { value: ethers.utils.parseEther("1") };
  await contract.connect(from1).buyChai("from1", "very nice chai", amount);
  await contract.connect(from2).buyChai("from2", "very nice course", amount);
  await contract.connect(from3).buyChai("from3", "very nice information", amount);

  console.log("after buying chai");
  await consoleBalances(addresses);

  const memos = await contract.getMemos();
  consoleMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
