import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import abi from "./abi.json"


// const provider = new HDWalletProvider(mnemonic,"http://localhost:8545");
// const web3 = new Web3(provider);
const privateKey = ""
const contractAddress = "0x516ffd7D1e0Ca40b1879935B2De87cb20Fc1124b"
const betterAddress = "0xE14B67fF72Ad34FFF91622F9A634F205810701e0"
const gasLimit = 141829
const minBetAmount = "100000000000000000" // 0.1 BNB
const web3 = new Web3(window.ethereum);
const myContract = new web3.eth.Contract(abi, contractAddress);

const threshold = 1.03
let nextAllowedBlock;
let locked = false

web3.eth.subscribe("newBlockHeaders", async (error, event) => {
  if (locked) return;
  locked = true;
  if (!error) {

    let epoch = await myContract.methods.currentEpoch().call()
    console.log("Current Epoch: ", epoch)
    let data = await myContract.methods.rounds(epoch).call()
    let currentBlock = event.number
    let blockDiff = data.lockBlock - currentBlock
    console.log("current block: ", currentBlock, " startBlock: ", data.lockBlock, " diff: ", blockDiff)

    if (currentBlock <= nextAllowedBlock) {
      locked = false;
      return;
    }

    if (blockDiff <= 5 & blockDiff >= 2) {
      console.log("Bet")
      nextAllowedBlock = currentBlock + 10
      await execute(data)
    } else {
      console.log("Not Bet")
      locked = false;
      return

    }

    locked = false;

    return;
  }
  console.log(error);
});

/////////////////// MAKE A BET ////////////////////////
const bet = async (side) => {

  console.log("BET", side)

  let data;
  let nonce = await web3.eth.getTransactionCount(betterAddress);

  if (side === "bull") {
    data = myContract.methods.betBull().encodeABI()
  } else {
    data = myContract.methods.betBear().encodeABI()
  }

  
  const tx = {

    from: betterAddress,
    to: contractAddress,
    gas: gasLimit,
    value: minBetAmount,
    data: data,
    nonce: web3.utils.toHex(nonce)
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  const sentTx = await web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
  console.log(sentTx)
}

const claim = async () => {
  let ledger = await myContract.methods.getUserRounds(betterAddress, 0, 1000).call()
  let window = 10
  console.log("LEDGER", ledger[0])
  let filtered = ledger[0].slice(-window)
  console.log("filtered", filtered)

  for (const epoch of filtered) {
    let claimable = await myContract.methods.claimable(epoch, betterAddress).call()
    let round = await myContract.methods.ledger(epoch, betterAddress).call()
    let claimed = round.claimed
    // let claimed = false

    console.log("CLAIMABLE: ", epoch, claimable, !claimed)
    if (claimable && !claimed) {
      let nonce = await web3.eth.getTransactionCount(betterAddress);
      const tx = {

        from: betterAddress,
        to: contractAddress,
        gas: gasLimit,
        data: myContract.methods.claim(epoch).encodeABI(),
        nonce: web3.utils.toHex(nonce)
      };

      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
      const sentTx = await web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
      console.log(sentTx)


    }
  }
}

/////////////////// Execute Logic ////////////////////////

const execute = async (data) => {



  //Calcuate 

  let rewardRate = await myContract.methods.rewardRate().call()
  // console.log("Reward Rate: ", rewardRate)
  let reward;
  let side = ""

  if (data.bearAmount > data.bullAmount) {

    reward = (data.bearAmount / data.bullAmount) * rewardRate / 100
    side = "bull"


  } else {

    reward = data.bullAmount / data.bearAmount * rewardRate / 100
    side = "bear"


  }
  console.log("Rewards: ", reward, " side: ", side)
  if (reward >= threshold) {
    //bet
    try {
      await bet(side)
    }
    catch (err) {
      console.log(err)
    }

    await claim()

  }
}


try {
  claim()
}
catch (err) {
  console.log(err)
}



/////////////////// RUNNN  ////////////////////////

// bet("bear")
//  setInterval(execute, 3000);







function App() {


  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
}

export default App;


//// NOTE 18.5228