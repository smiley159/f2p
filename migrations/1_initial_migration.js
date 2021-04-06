const Migrations = artifacts.require("Migrations");
const Pool = artifacts.require("Pool");
const BPool = artifacts.require("BPool");
const Bnb = artifacts.require("Bnb");
const Busd = artifacts.require("Busd");;

module.exports = async function (deployer) {
  deployer.deploy(Migrations);

  // await deployer.deploy(Busd);
  // await deployer.deploy(Pool, Bnb.address, Busd.address);
  await deployer.deploy(Bnb);
  let bnb = await Bnb.deployed()
  bnb.mint("0x28F81170d858cC4F31f9BBd070A1D8A34a3340d8", 10000)
  bnb.mint("0x7BcD12FA4899C8d93043A86B1c69763279A28240", 10000)

  let bPool = await deployer.deploy(BPool, Bnb.address);
};
