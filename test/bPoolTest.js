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
    let currentPoolID = await bPool.currentPoolID()



    assert.equal(owner, await bPool.owner(), "BPool owner Address not Correct")
    assert.equal(1,currentPoolID,"Pool ID should be 1")


  })

  it("Mint and Approve BNB token for alice and Bob", async () => {

    let bPool = await BPool.deployed();
    let bnb = await Bnb.deployed();

    await bnb.mint(alice,10000)
    await bnb.mint(bob,10000)

    assert.equal(10000, await bnb.balanceOf(alice), "Incorrect minted balance")
    assert.equal(10000, await bnb.balanceOf(bob), "Incorrect minted balance")

     bnb.approve(bPool.address,10000,{from:alice})
     bnb.approve(bPool.address,10000,{from:bob})

     assert.equal(10000, await bnb.allowance(alice,bPool.address),"Incorrect allowance balance")
     assert.equal(10000, await bnb.allowance(bob,bPool.address),"Incorrect allowance balance")

  })

  it("Start 1st betting Round", async () => {
    let bPool = await BPool.deployed();
    let x = await bPool.endCurrentRound()
    x.logs.map(e => {
      console.log(e.args[0],e.args[1])
    })
  })

  it("Alice will make a bet up, Bob will bet down", async () => {

    let bPool = await BPool.deployed();
    let bnb = await Bnb.deployed();

    await bPool.bet(5000,true,{from:alice})
    await bPool.bet(5000,false,{from:bob})

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
    
    //Alice Bet Up
    assert.equal(5000, await bltUp.balanceOf(alice,currentPoolID))
    assert.equal(0, await bltDown.balanceOf(alice,currentPoolID))
    assert.equal(0, await bltUp.balanceOf(bob,currentPoolID))
    assert.equal(5000, await bltDown.balanceOf(bob,currentPoolID))

    assert.equal(2,currentPoolID,"Pool ID should be 2")

  })

  it("Start 2nd and 3rd betting Round", async () => {
    let bPool = await BPool.deployed();
    await bPool.endCurrentRound()
    await bPool.endCurrentRound()
   
  })

  it("Bob and alice try to claim rewards", async () => {

    let bPool = await BPool.deployed();
    let bltUp = await BltUp.deployed();
    let bnb = await Bnb.deployed();
    let currentPoolID = await bPool.currentPoolID()
    let alpha = await bPool.alpha();

    console.log("ALPHA",alpha)

    await bltUp.setApprovalForAll(BPool.address,true,{from:alice})
    await bPool.claim(currentPoolID-2,{from:alice})
    await bPool.claim(currentPoolID-2,{from:bob})

    let aliceBnbBalance = await bnb.balanceOf(alice)
    let bobBnbBalance = await bnb.balanceOf(bob)


    assert.equal(4,currentPoolID,"Pool ID should be 4")
    assert.equal(14500,aliceBnbBalance,"Alice claimable Value not correct")
    assert.equal(5000,bobBnbBalance,"Bob claimable Value not correct")


    await bPool.claim(currentPoolID-2,{from:alice})
    await bPool.claim(currentPoolID-2,{from:bob})

    aliceBnbBalance = await bnb.balanceOf(alice)
    bobBnbBalance = await bnb.balanceOf(bob)

    assert.equal(14500,aliceBnbBalance,"Alice claimable Value not correct")
    assert.equal(5000,bobBnbBalance,"Bob claimable Value not correct")
    // let bPool = await BPool.deployed();
    // await bPool.endCurrentRound()
  })


})

