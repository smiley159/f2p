
import Home from './views/home.js'
import { useSelector, useDispatch } from 'react-redux'

import './App.css';
import 'semantic-ui-css/semantic.min.css'

import Web3 from 'web3';
import { useEffect, React } from 'react'



function App() {


  const dispatch = useDispatch()

  window.ethereum.on('accountsChanged', function (accounts) {
    // Time to reload your interface with accounts[0]!
    getAccounts()
  })

  const ethEnabled = () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable()
      return true;
    }
    return false;
  }

  const getAccounts = async () => {
    let accounts = await window.web3.eth.getAccounts()
    dispatch({ type: 'setState', account: accounts[0] })

  }


  useEffect(() => {
    ethEnabled()

  }, [])

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
