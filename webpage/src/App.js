import { useEffect, useState, React } from 'react'
import Home from './views/home.js'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@material-ui/core'
import BNB from './contracts/BNB.json';
import BPool from './contracts/BPool.json'

import './App.css';


import Web3 from 'web3';




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




  useEffect(async () => {
    if (state.web3Ready) {
      let _tokenContract = await new window.web3.eth.Contract(BNB.abi, BNB.networks["5777"].address)
      let _bPoolContract = await new window.web3.eth.Contract(BPool.abi, BPool.networks["5777"].address)
      dispatch({
        type: "setState",
        bPoolContract: _bPoolContract,
        tokenContract: _tokenContract,
        contractReady: true
      })

    }

  }, [state.web3Ready])

  return (
    <div className="App">


      {(state.web3Ready && state.contractReady) ? <Home /> :
        <Button onClick={() => ethEnabled()} variant="outlined" color="primary">
          {state.web3Ready ? state.account : "connect"}
        </Button>}
    </div>
  );
}

export default App;
