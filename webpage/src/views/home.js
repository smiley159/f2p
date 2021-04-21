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
    <Grid columns={1} >



      <Grid.Column style={{ height: "100%", position: "absolute" }}>
        <Sidebar.Pushable as={Segment}  >
          <div style={{ float: "right" }}>
            <Button basic color='orange' style={{ marginTop: 10 }} >
              {state.account}
            </Button>
          </div>
          <Sidebar
            as={Menu}
            animation='scale down'
            direction='left'
            vertical
            visible={true}

          >
            <Menu.Item as='a' header>
              File Permissions
            </Menu.Item>
            <Menu.Item as='a'>Share on Social</Menu.Item>
            <Menu.Item as='a'>Share by E-mail</Menu.Item>
            <Menu.Item as='a'>Edit Permissions</Menu.Item>
            <Menu.Item as='a'>Delete Permanently</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher>
            <Segment>
              {/* <Header as='h3'>Address</Header> */}
              {/* <Image src={paragraph} /> */}

              <Tabs />


            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Grid.Column>
    </Grid>
  )

}

export default Home