import React from 'react'
import { Button, Grid, Header, Image, Segment } from 'semantic-ui-react'
import { ProgressBar } from 'react-bootstrap'
import triangle from './triangleIcon.png';
import Timer from './timer.js'

const x = 54.32

const ButtonExampleMultipleConditionals = () => {



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


            <h1> Predicting BTC/USDT Price</h1>
            <h2> And Earn 2X</h2>
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

export default ButtonExampleMultipleConditionals