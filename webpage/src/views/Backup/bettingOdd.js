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


  const [startPrice, setStartPrice] = useState(0)
  const [endPrice, setEndPrice] = useState(0)

  const [claimable, setClaimable] = useState(0)


  useEffect(async () => {
    const interval = setInterval(async () => {
      console.log("Interval")
      updateData()
    }, 10000)

    return () => clearInterval(interval)


  }, [])

  useEffect(async () => {

    updateData()

  }, [props.pool])

  const updateData = () => {
    updateBet()
    updatePrice()
    updateClaimable()
  }

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

  const updatePrice = async () => {

    if (props.pool !== null) {
      let _startPrice = await props.pool.methods.startPrice().call()
      let _endPrice = await props.pool.methods.endPrice().call()

      _startPrice = parseInt(String(_startPrice).substring(0, 5))
      _endPrice = parseInt(String(_endPrice).substring(0, 5))

      setStartPrice(_startPrice)
      setEndPrice(_endPrice)
      return [_startPrice, _endPrice]
    }
  }

  const judge = async () => {
    if (props.pool !== null) {
      await props.pool.methods.judge().send({ from: state.account })
    }
  }

  const claim = async () => {
    if (props.pool !== null) {
      await props.pool.methods.claim().send({ from: state.account })
    }
  }

  const updateClaimable = async () => {
    if (props.pool !== null) {
      let temp = await props.pool.methods.getClaimable().call()
      setClaimable(temp)
    }
  }


  return (



    <Segment>
      <Grid columns={2} relaxed='very'>
        <Grid.Column>
          <BarGraph betUp={betUp} betDown={betDown} startPrice={startPrice} endPrice={endPrice} />

        </Grid.Column>
        <Grid.Column>

          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Input placeholder='Bet Up...' onChange={(e) => setBetUpValue(e.target.value)} style={{ width: "100%" }} />
              </Grid.Column >
              <Grid.Column width={4}>
                <Button basic color="green" onClick={() => makeABet(betUpValue, true)} style={{ width: "100%" }}> Bet Up </Button>
              </Grid.Column >
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={12}>
                <Input placeholder='Bet Down...' onChange={(e) => setBetDownValue(e.target.value)} style={{ width: "100%" }} />
              </Grid.Column >
              <Grid.Column width={4}>
                <Button basic color="red" onClick={() => makeABet(betDownValue, false)} style={{ width: "100%" }}> Bet Down </Button>
              </Grid.Column >
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={4}>
                <Button basic color="red" onClick={() => judge()} style={{ width: "100%" }}>Burn </Button>
              </Grid.Column >
              <Grid.Column width={4}>
                <Button basic color="red" onClick={() => claim()} style={{ width: "100%" }}> Claim {claimable} </Button>
              </Grid.Column >
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={6} >
                <div style={{ textAlign: "left" }}>
                  <div> Start Price: {startPrice}</div>
                  <div> End Price: {endPrice}</div>
                </div>
              </Grid.Column>
            </Grid.Row>

          </Grid>



        </Grid.Column>

      </Grid>

      <Divider vertical>Bet</Divider>
    </Segment>
  )

}

export default App;
