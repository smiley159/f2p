
import Home from './views/home.js'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Button } from 'semantic-ui-react'

import './App.css';
import 'semantic-ui-css/semantic.min.css'

import Web3 from 'web3';
import { useEffect, useState, React } from 'react'



function App() {

  let state = useSelector(state => state)
  const dispatch = useDispatch()

  window.ethereum.on('accountsChanged', function (accounts) {
    getAccounts()

  })


  const ethEnabled = () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable().then(async () => {
        await getAccounts()
        dispatch({ type: "setState", web3Ready: true })
      })
      return true;
    }
    dispatch({ type: "setState", web3Ready: true })
    return false;
  }

  const getAccounts = async () => {
    let accounts = await window.web3.eth.getAccounts()
    window.web3.eth.defaultAccount = accounts[0]

    dispatch({ type: 'setState', account: accounts[0] })

  }




  useEffect(() => {
  }, [])

  return (
    <div className="App">


      {state.web3Ready ? <Home /> :
        <Button onClick={() => ethEnabled()} basic color='orange'>
          {state.web3Ready ? state.account : "connect"}
        </Button>}
    </div>
  );
}

export default App;
