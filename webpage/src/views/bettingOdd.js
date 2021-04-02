import 'semantic-ui-css/semantic.min.css'
import { Container, Button } from 'semantic-ui-react'
import { useEffect, useState, React } from 'react'
import { useSelector, useDispatch } from 'react-redux'



function App(props) {

  const state = useSelector(state => state)
  const dispatch = useDispatch()



  const [pool, setPool] = useState({})
  const [token, setToken] = useState({})

  const [betUp, setBetUp] = useState(0)
  const [betDown, setBetDown] = useState(0)


  useEffect(async () => {

    if (state.web3Ready) {


      console.log("Default Account", window.web3.eth.defaultAccount)

      console.log("Pool ABI", props.pool.abi)

      let _pool = new window.web3.eth.Contract(props.pool.abi, props.pool.networks["5777"].address)
      let _token = new window.web3.eth.Contract(props.token.abi, props.token.networks["5777"].address)

      setPool(_pool)
      setToken(_token)

      _pool.events.betEvent({}, (error, event) => {
        let values = event.returnValues
        if (values.side === "up") {
          setBetUp(values.amount)
        } else {
          setBetDown(values.amount)
        }

      })

    }


  }, [state.web3Ready])

  // const eventSubscribe = async () => {

  // }




  const makeABet = async (_amount, _up) => {
    let balance = await token.methods.balanceOf(state.account).call()
    console.log("BALANCE before bet", balance)
    let betted = await pool.methods.bet(_amount, _up).send({ from: state.account })
    console.log(betted)
  }

  return (
    <div>
      <hr></hr>
      <div>
        <Button primary onClick={() => makeABet(10, true)}> BetUp </Button>
        <Button primary onClick={() => makeABet(10, false)}> BetDown </Button>

        <br></br>
        betUpAmount: {betUp}
        <br></br>
        betDownAmount: {betDown}
      </div>

    </div>
  )

}

export default App;
