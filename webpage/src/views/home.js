import React from 'react'
import paragraph from './paragraph.png';
import {
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
} from 'semantic-ui-react'

import Tabs from './tabs.js'

const SidebarExampleMultiple = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <Grid columns={1} >

      {/* <Grid.Column>
        <Checkbox
          checked={visible}
          label={{ children: <code>visible</code> }}
          onChange={(e, data) => setVisible(data.checked)}
        />
      </Grid.Column> */}

      <Grid.Column style={{ height: "100%", position: "absolute" }}>
        <Sidebar.Pushable as={Segment}  >
          <Sidebar
            as={Menu}
            animation='scale down'
            direction='left'
            inverted
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
            <Segment basic>
              <Header as='h3'>Application Content</Header>
              {/* <Image src={paragraph} /> */}
              <Tabs></Tabs>
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Grid.Column>
    </Grid>
  )
}

export default SidebarExampleMultiple