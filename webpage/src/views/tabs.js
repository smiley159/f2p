import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PoolContent from './poolContent.js'



const TabExampleSecondaryPointing = () => {

  let state = useSelector(state => state)
  const [value, setValue] = React.useState(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column"
    }}>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Active" index={0} />
        <Tab label="Disabled" index={1} />
        <Tab label="Active" index={2} />
      </Tabs>
      <br></br>
      <PoolContent></PoolContent>
    </div>
  )
}

export default TabExampleSecondaryPointing
