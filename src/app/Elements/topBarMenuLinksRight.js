import * as Colors from 'material-ui/styles/colors'
import { APP, DS } from '../_utils/const.js'
import { Link, withRouter } from 'react-router-dom'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar'
import { connect } from 'react-redux'
import AccountIcon from 'material-ui/svg-icons/action/account-circle'
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down'
import Chat from 'material-ui/svg-icons/communication/chat'
import FlatButton from 'material-ui/FlatButton'
import Help from 'material-ui/svg-icons/action/help'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import NotificationWifi from 'material-ui/svg-icons/notification/wifi'
import Popover from 'material-ui/Popover'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Settings from 'material-ui/svg-icons/action/settings'
// import ElementNotificationsDrawer from '.Elements/elementNotificationsDrawer'
import { Actions } from '../_redux/actions'
import Badge from 'material-ui/Badge'
import styles from './elements.module.css'
import utils from '../_utils/utils'

function mapStateToProps(state) {
  return state
}

let menuStyles = {
  dropDown: {
    color: '#ffffff'
  },
  separator: {
    backgroundColor: '#ffffff',
    opacity: 0.5
  },
  profileIcon: {
    open: {
      color: '#054186'
    },
    closed: {
      color: '#ffffff'
    }
  }
}

let disabledUserType = {
  dropDown: {}
}

let enabledUserType = {
  dropDown: {
    color: '#ffffff'
  }
}

class NavLinks extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    handleToggleNotifications: PropTypes.func.isRequired,
    transactions: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  }

  state = {
    notificationsOpen: false,
    allEvents: null,
    minedEvents: null,
    pendingEvents: null,
    subscriptionIDDrago: null,
    transactionsDrawerOpen: false,
    transactionsDrawerNetworkButtonStyle: styles.networkIconClosed,
    transactionsDrawerNetworkButtonIconStyle: menuStyles.profileIcon.closed
  }

  shouldComponentUpdate(nextProps, nextState) {
    let stateUpdate = true
    let propsUpdate = true
    propsUpdate = !utils.shallowEqual(this.props, nextProps)
    stateUpdate = !utils.shallowEqual(this.state, nextState)
    if (stateUpdate || propsUpdate) {
      // console.log(`${this.constructor.name} -> shouldComponentUpdate: TRUE -> Proceedding with rendering.`);
    }
    return stateUpdate || propsUpdate
  }

  // value = 1 = Trader
  // value = 2 = Manager
  handleTopBarSelectAccountType = (event, value) => {
    const accountType = {
      false: false,
      true: true
    }
    this.props.dispatch(Actions.users.isManagerAction(accountType[value]))
  }

  componentDidMount() {
    this.activeSectionPath()
  }

  activeSectionPath = () => {
    const { match } = this.props
    let path = match.path.split('/')
    return path[3]
  }

  buildUrlPath = location => {
    let path = location.pathname.split('/')
    // path.splice(-1,1);
    // var url = path.join('/');
    return path[2]
  }

  handleClick = event => {
    // This prevents ghost click.
    event.preventDefault()
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    })
  }

  handleToggleNotifications = () => {
    let transactionsDrawerNetworkButtonStyle,
      transactionsDrawerNetworkButtonIconStyle
    !this.state.transactionsDrawerOpen
      ? (transactionsDrawerNetworkButtonStyle = styles.networkIconOpen)
      : (transactionsDrawerNetworkButtonStyle = styles.networkIconClosed)
    !this.state.transactionsDrawerOpen
      ? (transactionsDrawerNetworkButtonIconStyle = menuStyles.profileIcon.open)
      : (transactionsDrawerNetworkButtonIconStyle =
          menuStyles.profileIcon.closed)
    this.setState({
      transactionsDrawerOpen: !this.state.transactionsDrawerOpen,
      transactionsDrawerNetworkButtonStyle,
      transactionsDrawerNetworkButtonIconStyle
    })
    this.props.handleToggleNotifications()
  }

  render() {
    const { location, user } = this.props
    const { transactions } = this.props
    // let userTypeDisabled = false;
    let userTypeLabel = 'HOLDER'
    const buttonAccountType = {
      border: '1px solid',
      borderColor: '#FFFFFF'
      // width: "140px"
    }
    // Disabling user type if isManager not defined
    if (typeof user.isManager === 'undefined') {
      user.isManager = false
      // userTypeDisabled = true;
      menuStyles = { ...menuStyles, ...disabledUserType }
    } else {
      user.isManager ? (userTypeLabel = 'WIZARD') : (userTypeLabel = 'HOLDER')
      menuStyles = { ...menuStyles, ...enabledUserType }
    }
    return (
      <Toolbar style={{ background: '' }}>
        <ToolbarGroup>
          <ToolbarSeparator style={menuStyles.separator} />
          <ToolbarGroup>
            <FlatButton
              onClick={this.handleClick}
              labelPosition="before"
              label={userTypeLabel}
              labelStyle={{ color: '#FFFFFF' }}
              style={buttonAccountType}
              icon={<ArrowDropDown color="#FFFFFF" />}
              hoverColor={Colors.blue300}
            />
            <Popover
              open={this.state.open}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
              onRequestClose={this.handleRequestClose}
              style={{ marginTop: '5px' }}
            >
              <Menu
                value={user.isManager}
                onChange={this.handleTopBarSelectAccountType}
                desktop={true}
                className={styles.menuAccountType}
              >
                <MenuItem
                  value={false}
                  primaryText={
                    <div>
                      <div className={styles.menuItemPrimaryText}>HOLDER</div>
                      <div>
                        <small>Invest in funds</small>
                      </div>
                    </div>
                  }
                />
                <MenuItem
                  value={true}
                  primaryText={
                    <div>
                      <div className={styles.menuItemPrimaryText}>WIZARD</div>
                      <div>
                        <small>Manage your funds</small>
                      </div>
                    </div>
                  }
                />
              </Menu>
            </Popover>
            <IconMenu
              iconButtonElement={
                <IconButton>
                  <AccountIcon />
                </IconButton>
              }
              iconStyle={menuStyles.profileIcon.closed}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              desktop={true}
            >
              <MenuItem
                leftIcon={<Settings />}
                value="config"
                primaryText="Config"
                containerElement={
                  <Link
                    to={
                      DS +
                      APP +
                      DS +
                      this.buildUrlPath(location) +
                      DS +
                      'config'
                    }
                  />
                }
              />
              <MenuItem
                leftIcon={<Chat />}
                value="community"
                primaryText="Community"
                containerElement={
                  <a
                    href="https://community.rigoblock.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Community
                  </a>
                }
              />
              <MenuItem
                leftIcon={<Help />}
                value="help"
                primaryText="Help"
                containerElement={
                  <a
                    href="https://help.rigoblock.com/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Community
                  </a>
                }
              />
            </IconMenu>
            {transactions.pending > 0 ? (
              <div className={this.state.transactionsDrawerNetworkButtonStyle}>
                <Badge
                  badgeContent={transactions.pending}
                  secondary={true}
                  style={{ padding: '0px !important' }}
                  badgeStyle={{
                    top: 0,
                    right: 0,
                    fontSize: '10px',
                    width: '20px',
                    height: '20px'
                  }}
                >
                  <IconButton
                    tooltip="Network"
                    onClick={this.handleToggleNotifications}
                    iconStyle={
                      this.state.transactionsDrawerNetworkButtonIconStyle
                    }
                  >
                    <NotificationWifi />
                  </IconButton>
                </Badge>
              </div>
            ) : (
              <div className={this.state.transactionsDrawerNetworkButtonStyle}>
                <IconButton
                  tooltip="Network"
                  onClick={this.handleToggleNotifications}
                  iconStyle={
                    this.state.transactionsDrawerNetworkButtonIconStyle
                  }
                  // style={{
                  //   marginTop: "-5px",
                  //   marginBottom: "-5px"
                  // }
                  // }
                >
                  <NotificationWifi />
                </IconButton>
              </div>
            )}
          </ToolbarGroup>
        </ToolbarGroup>
      </Toolbar>
    )
  }
}

export default withRouter(connect(mapStateToProps)(NavLinks))
