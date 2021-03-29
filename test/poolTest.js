// SPDX-License-Identifier: UNLICENSED

const Pool = artifacts.require("Pool");
const Bnb = artifacts.require("Bnb");
const Busd = artifacts.require("Busd");


contract("Pool", async (accounts) => {

  let [owner, alice, bob] = accounts


  it("Initialized Pool", async () => {

    let bnb = await Bnb.deployed();
    let busd = await Busd.deployed();
    let pool = await Pool.deployed();

    //Mint for Pool
    await bnb.mint(owner, 10000)
    await busd.mint(owner, 10000)
    //Mint for Alice
    await bnb.mint(alice, 100)
    await busd.mint(bob, 100)
    //Mint for Bob
    await bnb.mint(alice, 100)
    await busd.mint(bob, 100)

    // assert.equal(owner, await pool.owner(), "Address not Correct")


  })

  it("Owner Deposit BNB and BUSD to pool", async () => {
    let bnb = await Bnb.deployed();
    let busd = await Busd.deployed();
    let pool = await Pool.deployed();


    await bnb.approve(pool.address, 3000) // call by owner by default
    await pool.deposit(3000, bnb.address) // owner deposit 3000 bnb into the pool

    assert.equal(await bnb.balanceOf(pool.address), 3000, "POOL Balance incorrect after first deposit")
    assert.equal(await bnb.balanceOf(owner), 7000, "POOL Balance incorrect after first deposit")




  })

  it("Check owner balance inside the pool after owner deposited", async () => {
    let bnb = await Bnb.deployed();
    let pool = await Pool.deployed();
    assert.equal(await pool.getBalance(owner, bnb.address), 3000, "BNB Balance of owner inside the pool is inccorect")

  })


})

