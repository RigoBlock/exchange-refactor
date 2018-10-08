import { APP, DS } from '../_utils/const.js'
import { Hidden, Visible } from 'react-grid-system'
import { Link, withRouter } from 'react-router-dom'
import ActionAssessment from 'material-ui/svg-icons/action/assessment'
import ActionShowChart from 'material-ui/svg-icons/editor/show-chart'
import Drawer from 'material-ui/Drawer'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './elements.module.css'

let drawerStyle = {
  activeLink: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: 'black'
  }
}

class LeftSideDrawerFunds extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    isManager: PropTypes.bool.isRequired
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

  renderMenuTrader = () => {
    let { location } = this.props
    return (
      <Drawer
        open={true}
        containerClassName={styles.containerleftDrawer}
        className={styles.leftDrawer}
      >
        <Hidden xs sm md>
          <Menu
            selectedMenuItemStyle={drawerStyle.activeLink}
            value={this.setSelectedLink(location)}
          >
            <MenuItem
              checked={true}
              primaryText="Dashboard"
              leftIcon={<ActionAssessment />}
              containerElement={
                <Link
                  to={
                    DS +
                    APP +
                    DS +
                    this.buildUrlPath(location) +
                    DS +
                    'drago' +
                    DS +
                    'dashboard'
                  }
                />
              }
              value="dashboard"
            />
            <MenuItem
              primaryText="Funds"
              leftIcon={<ActionShowChart />}
              containerElement={
                <Link
                  to={
                    DS +
                    APP +
                    DS +
                    this.buildUrlPath(location) +
                    DS +
                    'drago' +
                    DS +
                    'pools'
                  }
                />
              }
              value="pools"
            />
          </Menu>
        </Hidden>

        <Visible xs sm md>
          <Menu
            selectedMenuItemStyle={drawerStyle.activeLink}
            value={this.setSelectedLink(location)}
          >
            <MenuItem
              checked={true}
              primaryText=""
              leftIcon={<ActionAssessment />}
              value="dashboard"
            />
            <MenuItem
              primaryText=""
              leftIcon={<ActionShowChart />}
              value="pools"
            />
          </Menu>
        </Visible>
      </Drawer>
    )
  }

  renderMenuManager = () => {
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
              primaryText="Dashboard"
              leftIcon={<ActionAssessment />}
              containerElement={
                <Link
                  to={
                    DS +
                    APP +
                    DS +
                    this.buildUrlPath(location) +
                    DS +
                    'drago' +
                    DS +
                    'dashboard'
                  }
                />
              }
              value="dashboard"
            />
          </Menu>
        </Hidden>
      </Drawer>
    )
  }

  render() {
    let { isManager } = this.props
    return isManager ? this.renderMenuManager() : this.renderMenuTrader()
  }
}

export default withRouter(LeftSideDrawerFunds)
