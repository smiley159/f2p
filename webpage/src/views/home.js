import 'semantic-ui-css/semantic.min.css'
import { Container, Button } from 'semantic-ui-react'
import { useEffect, useState, React } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import BNB from "../contracts/BNB.json"



function App() {

  let state = useSelector(state => state)
  let alice = state.account
  const bnbAddress = "0xFe0b03996b6fe01a875Ff4520C4E043ad5D9248a"
  const bob = "0xE14B67fF72Ad34FFF91622F9A634F205810701e0"

  const mint = async () => {



    let contract = new window.web3.eth.Contract(BNB.abi, bnbAddress)

    // Test Mint

    let mint = await contract.methods.mint(alice, 100000).call()
    console.log("mint", mint)

    // Check balance

    let balance = await contract.methods.balanceOf(alice).call()
    console.log("Balance", balance)

  }

  const sendTransaction = async () => {

    window.web3.eth.sendTransaction({ from: alice, to: bob, value: 10000000000000000 });
  }

  return (
    <div style={{ margin: 20 }}>
      <Container>
        <h4>{state.account}</h4>
        <Button primary onClick={mint}>
          Mint
      </Button>
        <Button primary onClick={sendTransaction}>
          Send Transaction
      </Button>
        <h1>Hi</h1>

      </Container>
    </div>
  );
}

export default App;
