
import Home from './views/home.js'
import { useDispatch } from 'react-redux'

import './App.css';
import 'semantic-ui-css/semantic.min.css'

import Web3 from 'web3';
import { useEffect, useState, React } from 'react'



function App() {


  const dispatch = useDispatch()
  const [ready, setReady] = useState(false)

  window.ethereum.on('accountsChanged', function (accounts) {
    getAccounts()

  })

  const ethEnabled = () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable().then(async () => {
        await getAccounts()
        setReady(true)
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
    ethEnabled()
    getAccounts()

  }, [])

  return (
    <div className="App">
      {ready ? <Home /> : null}
    </div>
  );
}

export default App;
