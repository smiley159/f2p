import React, { useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react'
import { Bar } from 'react-chartjs-2'
import 'chartjs-plugin-datalabels';



const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  plugins: {
    datalabels: {
      display: ctx => {
        return true;
      },
      formatter: (ctx, data) => {
        console.log("DATA", data)
        return `${data.dataset.data[data.dataIndex]}`;
      }
    }
    // plugins: {
    //   datalabels: {
    //     display: true,
    //     color: 'red'
    //   }
    // }
  }
}

const BarGraph = (props) => {

  const [data, setData] = useState({})

  useEffect(() => {
    genData()
  }, [props.betUp, props.betDown])

  const genData = async () => {
    setData({
      labels: ['Buy', 'Sell'],
      datasets: [
        {
          label: 'BNB Amount',
          data: [props.betUp, props.betDown],
          backgroundColor: [
            'rgba(11, 156, 49, 0.6)',
            'rgba(255, 0, 0, 0.6)',

          ],
          borderColor: [
            'rgba(11, 156, 49, 0.8)',
            'rgba(255, 0, 0, 0.8)',

          ],
          borderWidth: 1,
        },
      ],
    })
  }


  return (
    <>
      <div className='header'>
        {/* <h1 className='title'>BNB Betting Pool</h1> */}
        <div className='links'>
          <a
            className='btn btn-gh'
            href='https://github.com/reactchartjs/react-chartjs-2/blob/react16/example/src/charts/Dynamic.js'
          >
            Read Docs
          </a>
        </div>
      </div>
      <Bar data={data} options={options} />
    </>
  )
}

export default BarGraph