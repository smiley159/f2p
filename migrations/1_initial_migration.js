const Migrations = artifacts.require("Migrations");
const Pool = artifacts.require("Pool");
const BPool = artifacts.require("BPool");
const Bnb = artifacts.require("Bnb");
const Busd = artifacts.require("Busd");;

module.exports = async function (deployer) {
  deployer.deploy(Migrations);
  await deployer.deploy(Bnb);
  await deployer.deploy(Busd);
  await deployer.deploy(Pool, Bnb.address, Busd.address);
  await deployer.deploy(BPool, Bnb.address);
};
