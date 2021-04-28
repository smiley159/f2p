import 'semantic-ui-css/semantic.min.css'
import { Container, Button } from 'semantic-ui-react'
import { useEffect, useState, React } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import BNB from "../contracts/BNB.json"
import BPool from "../contracts/BPool.json"

import BettingOdd from "./bettingOdd"


function App() {

  let state = useSelector(state => state)
  let userAddress = state.account
  let alice = state.alice
  let bob = state.bob
  let pool = state.pool



  const bnbAddress = BNB.networks["5777"].address
  const BPoolAddress = BPool.networks["5777"].address


  const [userBalance, setUserBalance] = useState(0)
  const [aliceBalance, setAliceBalance] = useState(0)
  const [bobBalance, setBobBalance] = useState(0)
  const [poolBalance, setPoolBalance] = useState(0)

  const [tokenContract, setTokenContract] = useState(null)
  const [poolContract, setPoolContract] = useState(null)

  // console.log("BNB ABI", BNB.abi)

  useEffect(async () => {

    let _tokenContract = await new window.web3.eth.Contract(BNB.abi, bnbAddress)
    let _poolContract = await new window.web3.eth.Contract(BPool.abi, BPoolAddress)

    console.log(_poolContract, "PCONTRACT")
    setTokenContract(_tokenContract)
    setPoolContract(_poolContract)
  }, [])

  useEffect(async () => {

    // Update user balance when contract change or user changed
    if (state.account !== "" && tokenContract !== null) updateUserBalance()

  }, [state.account, tokenContract])


  useEffect(async () => {

    // update subscribe to event when contract is ready
    if (tokenContract !== null) eventSubscription()

  }, [tokenContract])

  const eventSubscription = async () => {
    //Subscribe to all events
    tokenContract.events.allEvents(function (err, event) {
      if (err) {
        console.error('Error', err)
        process.exit(1)
      }

      // console.log('Event', event)
      if (event.event === "Transfer") {
        // console.log("EVENT TRANSFER")
        updateUserBalance()
      }

    })

  }

  const updateUserBalance = async () => {

    let userBalance = await tokenContract.methods.balanceOf(userAddress).call()
    let aliceBalance = await tokenContract.methods.balanceOf(alice).call()
    let bobBalance = await tokenContract.methods.balanceOf(bob).call()
    let poolBalance = await tokenContract.methods.balanceOf(pool).call()

    setUserBalance(userBalance)
    setAliceBalance(aliceBalance)
    setBobBalance(bobBalance)
    setPoolBalance(poolBalance)


  }

  const mint = async (adress) => {

    if (tokenContract !== null) {

      tokenContract.methods.mint(adress, 100000).send({ from: userAddress })
    }


  }

  const approve = async () => {


    tokenContract.methods.approve(BPoolAddress, 1000000).send({ from: state.account })

  }

  return (

    <Container>

      <Button primary onClick={() => mint(alice)}>
        Mint Alice
      </Button>
      <Button primary onClick={() => mint(bob)}>
        Mint Bob
      </Button>
      <Button primary onClick={approve}>
        Approve
      </Button>
      <br></br>
        User Balance: {userBalance}
      <br></br>
        Alice Balance: {aliceBalance}
      <br></br>
        Bob Balance: {bobBalance}
      <br></br>
        Pool Balance: {poolBalance}

      {state.web3Ready ? <BettingOdd pool={poolContract} token={tokenContract} /> : null}

    </Container>

  );
}

export default App;
