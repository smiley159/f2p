import React from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;
const x = 75

const timerProps = {
  isPlaying: true,
  size: 300,
  strokeWidth: 12,

};

const renderTime = (dimension, time) => {
  return (
    <div className="time-wrapper">
      <div className="time">{time}</div>
      <div>{dimension}</div>
    </div>
  );
};

const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;



const Timer = (props) => {
  const startTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = startTime + 243248; // use UNIX timestamp in seconds

  const remainingTime = endTime - startTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer">Too lale...</div>;
    }

    return (
      <div className="timer">
        <h1 className="axd">${props.price}</h1>
        <div className="text">Time </div>
        <div className="value">{remainingTime}</div>
        <div className="text">seconds</div>
      </div>
    );
  };

  return (
    <div className="timer-wrapper">
      <CountdownCircleTimer
        isPlaying
        duration={60}
        colors={[["#016936", 0.33], ["#FFD700", 0.33], ["#B03060"]]}
        onComplete={() => [true, 1000]}
        size={300}
      >
        {renderTime}
      </CountdownCircleTimer>
    </div>

  )


}

export default Timer