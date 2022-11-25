// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();

  await nft.deployed().then(() => {
    console.log(`nft deployed to ${nft.address}`);
  });

  const MultiAccess = await hre.ethers.getContractFactory("MultiAccess");
  const multiAccess = await MultiAccess.deploy(nft.address);

  await multiAccess.deployed().then(() => {
    console.log(`multiAccess deployed to ${multiAccess.address}`);
  });

  let owner = await nft.owner();

  const beneficiary = "0xd0744bb9df5b1ba72cf8ed0acb845e60b74a30ac";

  await nft.safeMint(owner, 0).then(()=>{
    console.log("NFT 0 minted");
  });

  await nft.approve(multiAccess.address, 0).then(()=>{
    console.log("NFT 0 approved");
  });
  
  await nft.safeMint(owner, 1).then(()=>{
    console.log("NFT 1 minted");
  });

  await nft.approve(multiAccess.address, 1).then(()=>{
    console.log("NFT 1 approved");
  });



  const MarketPlace = await hre.ethers.getContractFactory("MarketPlace");
  const marketPlace1 = await MarketPlace.deploy(multiAccess.address);

  await marketPlace1.deployed().then(() => {
    console.log(`marketPlace1 deployed to ${marketPlace1.address}`);
  });

  const marketPlace2 = await MarketPlace.deploy(multiAccess.address);

  await marketPlace2.deployed().then(() => {
    console.log(`marketPlace2 deployed to ${marketPlace2.address}`);
  });

  await multiAccess.addWhitelist(marketPlace1.address).then(()=>{
    console.log(`Add whitelist marketPlace1 ${marketPlace1.address}`)
  })
  await multiAccess.addWhitelist(marketPlace2.address).then(()=>{
    console.log(`Add whitelist marketPlace2 ${marketPlace2.address}`)
  })

  console.log("\nbefore transfer\n");
  await nft.ownerOf(0).then(console.log);
  await nft.ownerOf(1).then(console.log);

  // await marketPlace1.transferToken(1,marketPlace1.address).then(console.log);



  await marketPlace1.transferToken(1,beneficiary).then(()=>{
    console.log(`marketPlace1 transfer nft 1 to ${beneficiary}`)
  });
  await marketPlace2.transferToken(0,beneficiary).then(()=>{
    console.log(`marketPlace2 transfer nft 0 to ${beneficiary}`)
  });

  console.log("\nafter transfer\n");

  await nft.ownerOf(0).then(console.log);
  await nft.ownerOf(1).then(console.log);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
