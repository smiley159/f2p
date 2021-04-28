import { React } from 'react'
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Header,
  Button,
  Menu,
  Segment,
  Sidebar,
} from 'semantic-ui-react'

import Tabs from './tabs.js'

function Home() {

  let state = useSelector(state => state)


  return (

    <div>
      <Tabs />
    </div>


  )

}

export default Home