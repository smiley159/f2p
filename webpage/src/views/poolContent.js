import { React, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { Button, Grid, Header, Image, Segment } from 'semantic-ui-react'
import { ProgressBar } from 'react-bootstrap'
import triangle from './triangleIcon.png';
import Timer from './timer.js'
import Countdown, { zeroPad } from 'react-countdown';
import {
  Paper,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Grid
} from '@material-ui/core'
import { render } from 'react-dom';

const Completionist = () => <span>You are good to go!</span>;

const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return <span>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
  }
};

const PoolContent = (props) => {

  const state = useSelector(state => state)
  const [poolID, setPoolID] = useState(3)

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
    <div style={{ width: "100%" }}>


      <Card elevation="3" style={{ width: "50%", margin: "0 auto" }}>
        <CardActionArea>
          <CardContent>
            <Grid container>
              <Grid item xs="1">

                <Typography gutterBottom variant="button h4" color="textSecondary" component="h4">
                  5
                </Typography>

              </Grid>
              <Grid item xs="1">
                <Typography variant="button h6" component="h6">
                  BTC/USDT
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Alpha 97%
                </Typography>
              </Grid>
              <Grid item xs="1">
                <Typography variant="button h6" component="h6">
                  $ {startPrice}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  <Countdown date={Date.now() + 100000}
                    renderer={renderer} />
                </Typography>
              </Grid>
              <Grid item xs="1">
                <Typography variant="button h6" component="h6">
                  $ {endPrice}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  <Countdown date={Date.now() + 100000} />
                </Typography>
              </Grid>
              <Grid item xs="3">

              </Grid>
              <Grid item xs="2">
                <Button style={{ margin: "0 auto" }} color="primary" variant="contained">Bet</Button>
              </Grid>

            </Grid>

          </CardContent>


        </CardActionArea>

      </Card>
    </div>

  )
}

export default PoolContent
