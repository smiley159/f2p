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

  it("Start 1st betting Round", async () => {
    let bPool = await BPool.deployed();
    await bPool.endCurrentRound()
  })

  it("Alice will make a bet up, Bob will bet down", async () => {

    let bPool = await BPool.deployed();
    let bnb = await Bnb.deployed();

    await bPool.bet(5000,true,{from:alice})
    await bPool.bet(3000,false,{from:bob})

  })

 

  //Burning rate 0%
  //Fee 0%
  // Round ended
  // Price Goes up
  // alice claim token return 10000
  // Burn BLT up
  // Bob claim token return 0
  // Burn BLT down


  it("Check Blt token of Alice and Bob", async () => {

    let bPool = await BPool.deployed();
    let bltUp = await BltUp.deployed();
    let bltDown = await BltDown.deployed();


    let currentPoolID = await bPool.currentPoolID()
    
    assert.equal(5000, await bltUp.balanceOf(alice,currentPoolID))
    assert.equal(0, await bltDown.balanceOf(alice,currentPoolID))
    assert.equal(0, await bltUp.balanceOf(bob,currentPoolID))
    assert.equal(3000, await bltDown.balanceOf(bob,currentPoolID))

  })

  it("Start 2nd betting Round", async () => {
    let bPool = await BPool.deployed();
    await bPool.endCurrentRound()
    console.log("PRICe",await bPool.getPrice(1), await bPool.getPrice(2))
  })

  it("Bob and alice try to claim rewards", async () => {
    // let bPool = await BPool.deployed();
    // await bPool.endCurrentRound()
  })


})

