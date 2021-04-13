// SPDX-License-Identifier: UNLICENSED

const BltUp= artifacts.require("BltUp");
const BltDown= artifacts.require("BltDown");
const BPool = artifacts.require("BPool");
const Bnb = artifacts.require("Bnb");
const Busd = artifacts.require("Busd");
const BltContainer = artifacts.require("BltContainer")


contract("Blt", async (accounts) => {

  let [owner, alice, bob] = accounts


  it("Initialized", async () => {

    let bnb = await Bnb.deployed();
    let bPool = await BPool.deployed();
 



    assert.equal(owner, await bPool.owner(), "BPool owner Address not Correct")



  })

  it("Mint and Approve BNB token for alice and Bob", async () => {

    let bPool = await BPool.deployed();
    let bnb = await Bnb.deployed();

    await bnb.mint(alice,10000)
    await bnb.mint(bob,20000)

    assert.equal(10000, await bnb.balanceOf(alice), "Incorrect minted balance")
    assert.equal(20000, await bnb.balanceOf(bob), "Incorrect minted balance")

     bnb.approve(bPool.address,10000,{from:alice})
     bnb.approve(bPool.address,20000,{from:bob})

     assert.equal(10000, await bnb.allowance(alice,bPool.address),"Incorrect allowance balance")
     assert.equal(20000, await bnb.allowance(bob,bPool.address),"Incorrect allowance balance")

  })

  it("Start a betting Round", async () => {
    let bPool = await BPool.deployed();
    await bPool.startNewRound()
  })

  it("Alice will make a bet up, Bob will bet down", async () => {

    let bPool = await BPool.deployed();
    let bnb = await Bnb.deployed();

    await bPool.bet(5000,true,{from:alice})
    await bPool.bet(3000,false,{from:bob})

  })


  it("Check Blt token of Alice and Bob", async () => {

    let bPool = await BPool.deployed();
    let bltUp = await BltUp.deployed();
    let bltDown = await BltDown.deployed();


    let currentRound = await bPool.currentRound()
    
    assert.equal(5000, await bltUp.balanceOf(alice,currentRound))
    assert.equal(0, await bltDown.balanceOf(alice,currentRound))
    assert.equal(0, await bltUp.balanceOf(bob,currentRound))
    assert.equal(3000, await bltDown.balanceOf(bob,currentRound))

  })


})

