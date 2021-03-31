import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { useEffect, useState, React } from 'react'


function App() {

  const [account, setAccount] = useState([])

  const ethEnabled = () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
      return true;
    }
    return false;
  }

  const getAccounts = async () => {
    let accounts = await window.web3.eth.getAccounts()
    console.log("ACC", accounts)
    setAccount(accounts)
  }





  useEffect(() => {
    ethEnabled()
    getAccounts()
  }, [])

  return (
    <div className="App">
      <h1>Hi</h1>
      {account[0]}
      {account[1]}
    </div>
  );
}

export default App;
