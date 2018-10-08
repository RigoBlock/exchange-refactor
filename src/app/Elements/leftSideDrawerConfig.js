import { APP, DS } from '../_utils/const.js'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import styles from './elements.module.css'

import { Hidden } from 'react-grid-system'
import ActionSwapHoriz from 'material-ui/svg-icons/action/swap-horiz'
import Drawer from 'material-ui/Drawer'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'

let drawerStyle = {
  activeLink: {
    backgroundColor: '#E0E0E0',
    color: '#757575'
  }
}

class LeftSideDrawerConfig extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    location: PropTypes.object.isRequired
  }

  state = {
    selectedItem: this.props.location.pathname
  }

  buildUrlPath = location => {
    let path = location.pathname.split('/')
    // path.splice(-1,1);
    // var url = path.join('/');
    return path[2]
  }

  setSelectedLink = location => {
    return location.pathname.split('/').pop()
  }

  render() {
    let { location } = this.props
    return (
      <Drawer
        open={true}
        containerClassName={styles.containerleftDrawer}
        className={styles.leftDrawer}
      >
        <Hidden xs sm>
          <Menu
            selectedMenuItemStyle={drawerStyle.activeLink}
            value={this.setSelectedLink(location)}
          >
            <MenuItem
              checked={true}
              primaryText="Network"
              leftIcon={<ActionSwapHoriz />}
              containerElement={
                <Link
                  to={
                    DS + APP + DS + this.buildUrlPath(location) + DS + 'network'
                  }
                />
              }
              value="network"
            />
          </Menu>
        </Hidden>
      </Drawer>
    )
  }
}

export default withRouter(LeftSideDrawerConfig)
