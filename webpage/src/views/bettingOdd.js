import 'semantic-ui-css/semantic.min.css'
import { Container, Button } from 'semantic-ui-react'
import { useEffect, useState, React } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import BarGraph from './barGraph'


function App(props) {

  const state = useSelector(state => state)
  const dispatch = useDispatch()



  // const [pool, setPool] = useState({})
  // const [token, setToken] = useState({})

  const [betUp, setBetUp] = useState(0)
  const [betDown, setBetDown] = useState(0)


  useEffect(async () => {

    if (state.web3Ready) {

      //Subscribe to all events
      // subscribeToEvents()

      //Constantly checking for bet amount
      const interval = setInterval(async () => {
        console.log("Interval")
        updateBet()
      }, 10000)

      return () => clearInterval(interval)



    }


  }, [props.pool])

  const subscribeToEvents = () => {
    if (props.pool !== null) {
      props.pool.events.betEvent({}, (error, event) => {
        let values = event.returnValues
        if (values.side === "up") {
          setBetUp(values.amount)
        } else {
          setBetDown(values.amount)
        }

      })
    }
  }




  const makeABet = async (_amount, _up) => {

    console.log("MAKE A BET PROPS POOL", props.pool)
    let balance = await props.token.methods.balanceOf(state.account).call()
    let betted = await props.pool.methods.bet(_amount, _up).send({ from: state.account })
    console.log("UPDATE BET")
    updateBet()
  }

  const updateBet = async () => {

    if (props.pool !== null) {
      let _betUp = await props.pool.methods.totalBetUp().call()
      let _betDown = await props.pool.methods.totalBetDown().call()
      setBetUp(_betUp)
      setBetDown(_betDown)
      return [_betUp, _betDown]
    }



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
      <hr></hr>
      <BarGraph betUp={betUp} betDown={betDown} />
    </div>
  )

}

export default App;
