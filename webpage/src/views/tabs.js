import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Tab, Button } from 'semantic-ui-react'
import PoolContent from './poolContent.js'

const panes = [
  {
    menuItem: 'Active Pools',
    render: () =>
      <Tab.Pane attached={false}>
        <PoolContent></PoolContent>
      </Tab.Pane>,
  },
  {
    menuItem: '1 Day',
    render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>,
  },
  {
    menuItem: '1 Hour',
    render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
  },
  {
    menuItem: '10 Minutes',
    render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane>,
  },
]

const TabExampleSecondaryPointing = () => {

  let state = useSelector(state => state)

  return (
    <div>



      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </div>
  )
}

export default TabExampleSecondaryPointing
