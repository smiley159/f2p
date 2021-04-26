import { React, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Grid, Header, Image, Segment } from 'semantic-ui-react'
import { ProgressBar } from 'react-bootstrap'
import triangle from './triangleIcon.png';
import Timer from './timer.js'

const x = 54.32

const PoolContent = (props) => {

  const state = useSelector(state => state)
  const [poolID, setPoolID] = useState(0)

  const [startPrice, setStartPrice] = useState(0)
  const [endPrice, setEndPrice] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [totalBetUp, setTotalBetUp] = useState(0)
  const [totalBetDown, setTotalBetDown] = useState(0)
  const [countDown, setCountDown] = useState(0)
  const [alpha, setAlpha] = useState(0)

  const dispatch = useDispatch()

  useEffect(() => {

    updateCurrentRound()

  }, [])

  const updateCurrentRound = async () => {

    let currentPoolID = await state.bPoolContract.methods.currentPoolID().call()
    dispatch({ type: "setState", currentPoolID: currentPoolID })
  }


  const endCurrentRound = () => {
    state.bPoolContract.methods.endCurrentRound().send({ from: state.account })
      .then((res) => {
        updateCurrentRound()
      })
  }

  const getPoolInfo = async () => {
    let poolInfo = await state.bPoolContract.methods.poolRecords(poolID).call()
    setStartPrice(poolInfo.startPrice)
    setEndPrice(poolInfo.endPrice)
    setStartTime(poolInfo.startTime)
    setEndTime(poolInfo.endTime)
    setTotalBetUp(poolInfo.totalBetUp)
    setTotalBetDown(poolInfo.totalBetDown)
    setAlpha(poolInfo.alpha)
    console.log("poolInfo", poolInfo)
  }

  return (
    <div style={{ boxShadow: "10px 30px 10px 0px #9E9E9E" }}>
      <Segment >
        <Grid columns={1} >
          <Grid.Column>
            <Button.Group>

              <Button  >Last Ended Round</Button>
              <Button.Or text=">" />
              <Button > Waiting Round</Button>
              <Button.Or text=">" />
              <Button color='green'>Current Round</Button>
            </Button.Group>
          </Grid.Column>

          <Grid.Column width="5">

            <h1>Start Price</h1>
            <div className="timer-wrapper">
              <Timer price="56,423.32" />
            </div>

          </Grid.Column>
          <Grid.Column width="5">


            <h1> Predicting BTC/USDT Price Round {state.currentPoolID}</h1>
            <h2> And Earn 2X</h2>
            <Button onClick={endCurrentRound}>End Round</Button>
            <Button onClick={getPoolInfo}>get Price</Button>
            <br></br>
            <br></br>
            <Grid>

              <Grid.Column width="8">
                <Button color='green' style={{ width: "100%", height: "60%", fontSize: 25 }}>
                  VOTE UP
              </Button>
                <h3>254,421.11 BNB ({x}%)</h3>

              </Grid.Column>
              <Grid.Column width="8">
                <Button color='red' style={{ width: "100%", height: "60%", fontSize: 25 }}>
                  VOTE DOWN
              </Button>
                <h3>234,421.11 BNB ({100 - x}%)</h3>


              </Grid.Column>
              <Grid.Column width="16">
                <div style={{
                  marginRight: `${(50 - x) * 2}%`
                  , display: "inline-block"

                }}> {x.toFixed(2) + "%"}</div>



                <ProgressBar style={{ height: 30 }}>
                  <ProgressBar style={{ backgroundColor: "#77dd77" }} now={x} key={1} />
                  <ProgressBar style={{ backgroundColor: "#ff6961" }} now={100 - x} key={2} />
                </ProgressBar>
              </Grid.Column>
            </Grid>


          </Grid.Column>
          <Grid.Column width="5">


            <h1>End Price</h1>
            <Timer price="xx,xxx.xx" />


          </Grid.Column>

          <Grid.Column width="5">

          </Grid.Column>
          <Grid.Column width="5">

            {/* <div style={{
              borderRadius: 10,
              border: "3px solid #e9ecef",
              padding: 10,
              // width: "80%",
              margin: "0 auto"

            }}>


              <div style={{
                marginRight: `${(50 - x) * 2}%`
                , display: "inline-block"

              }}> {x.toFixed(2) + "%"}</div>



              <ProgressBar style={{ height: 30 }}>
                <ProgressBar style={{ backgroundColor: "#77dd77" }} now={x} key={1} />
                <ProgressBar style={{ backgroundColor: "#ff6961" }} now={100 - x} key={2} />
              </ProgressBar>
            </div> */}
          </Grid.Column>
          <Grid.Column width="3">

          </Grid.Column>

        </Grid >
      </Segment >
    </div>
  )
}

export default PoolContent
