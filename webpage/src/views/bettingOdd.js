import 'semantic-ui-css/semantic.min.css'
import { Container, Button, Segment, Grid, Divider, Input } from 'semantic-ui-react'
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

  const [betUpValue, setBetUpValue] = useState(0)
  const [betDownValue, setBetDownValue] = useState(0)


  useEffect(async () => {

    if (state.web3Ready) {

      //Subscribe to all events
      // subscribeToEvents()

      //Constantly checking for bet amount
      updateBet()
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

    console.log("MAKE A BET PROPS POOL", _amount)
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



    <Segment>
      <Grid columns={2} relaxed='very'>
        <Grid.Column>
          <BarGraph betUp={betUp} betDown={betDown} />

        </Grid.Column>
        <Grid.Column>

          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Input placeholder='Bet Up...' onChange={(e) => setBetUpValue(e.target.value)} />
              </Grid.Column >
              <Grid.Column width={4}>
                <Button basic color="green" onClick={() => makeABet(betUpValue, true)}> Bet Up </Button>
              </Grid.Column >
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={12}>
                <Input placeholder='Bet Down...' onChange={(e) => setBetDownValue(e.target.value)} />
              </Grid.Column >
              <Grid.Column width={4}>
                <Button basic color="red" onClick={() => makeABet(betDownValue, false)}> Bet Down </Button>
              </Grid.Column >
            </Grid.Row>

          </Grid>



        </Grid.Column>

      </Grid>

      <Divider vertical>Bet</Divider>
    </Segment>
  )

}

export default App;
