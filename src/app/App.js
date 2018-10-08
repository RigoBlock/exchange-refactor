// Copyright 2016-2017 Rigo Investment Sagl.
import 'babel-polyfill'
import 'react-virtualized/styles.css'
import { PROD } from './_utils/const'
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import ApplicationConfigPage from './Application/applicationConfig'
import ApplicationDragoPage from './Application/applicationDrago'
import ApplicationExchangePage from './Application/applicationExchange'
import ApplicationHomePage from './Application/applicationHome'
import ApplicationVaultPage from './Application/applicationVault'
import Endpoint from './_utils/endpoint'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import NotificationSystem from 'react-notification-system'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Web3 from 'web3'
import Whoops404 from './Application/whoops404'
import createHashHistory from 'history/createHashHistory'

import { connect } from 'react-redux'
import AppLoading from './Elements/elementAppLoading'
import ElementNotification from './Elements/elementNotification'
import utils from './_utils/utils'
// import ElementNotConnected from './Elements/elementNotConnected'
import { Actions } from './_redux/actions'
import ReactGA from 'react-ga'

let appHashPath = true

ReactGA.initialize('UA-117171641-1')
ReactGA.pageview(window.location.pathname + window.location.search)

// Detectiong if the app is running inside Parity client
// var pathArray = window.location.hash.split('/');
// console.log(pathArray[2]);
if (typeof window.parity !== 'undefined') {
  // Need to check if this works inside the Parity UI
  // appHashPath = pathArray[2];
  appHashPath = 'web'
} else {
  appHashPath = 'web'
}

const history = createHashHistory()

// Setting the routes.
// Component Whoops404 is loaded if a page does not exist.

function mapStateToProps(state) {
  return state
}

export class App extends Component {
  constructor(props) {
    super(props)
    console.log(props)
    this._notificationSystem = null
    let endpoint = new Endpoint(
      this.props.endpoint.endpointInfo,
      this.props.endpoint.networkInfo
    )
    this._api = endpoint.connect()
  }

  scrollPosition = 0
  tdIsConnected = null
  tdIsMetaMaskUnlocked = null

  state = {
    isConnected: this.props.app.isConnected,
    isSyncing: this.props.app.isSyncing,
    syncStatus: this.props.app.syncStatus
  }

  // Defining the properties of the context variables passed down to children
  static childContextTypes = {
    api: PropTypes.object
  }

  static propTypes = {
    app: PropTypes.object.isRequired,
    endpoint: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  // Passing down the context variables to children
  getChildContext() {
    return {
      api: this._api
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log(this.props.user.isManager)
    const propsUpdate = !utils.shallowEqual(this.props, nextProps)
    const stateUpdate = !utils.shallowEqual(this.state, nextState)
    // console.log(`${this.constructor.name} -> propsUpdate: %c${propsUpdate}.%c stateUpdate: %c${stateUpdate}`, `color: ${propsUpdate ? 'green' : 'red'}; font-weight: bold;`,'',`color: ${stateUpdate ? 'green' : 'red'}; font-weight: bold;`)
    return stateUpdate || propsUpdate
  }

  componentDidMount = async () => {
    this.props.dispatch(
      Actions.notifications.initNotificationsSystemAction(
        this._notificationSystem
      )
    )
    const { endpoint } = this.props
    let WsSecureUrl = ''
    const networkName = this.props.endpoint.networkInfo.name
    if (PROD) {
      WsSecureUrl = this.props.endpoint.endpointInfo.wss[networkName].prod
    } else {
      WsSecureUrl = this.props.endpoint.endpointInfo.wss[networkName].dev
    }
    const web3 = new Web3(WsSecureUrl)
    this.props.dispatch(Actions.endpoint.checkIsConnectedToNode(this._api))
    this.props.dispatch(
      Actions.endpoint.attachInterface(web3, this._api, endpoint)
    )
    if (typeof window.web3 !== 'undefined') {
      const web3 = window.web3
      this.props.dispatch(
        Actions.endpoint.checkMetaMaskIsUnlocked(this._api, web3)
      )
    }
  }

  render() {
    let notificationStyle = {
      NotificationItem: {
        // Override the notification item
        DefaultStyle: {
          // Applied to every notification, regardless of the notification level
          margin: '0px 0px 0px 0px'
        },
        info: {
          // Applied only to the success notification item
          border: '1px solid',
          borderColor: '#EEEEEE',
          WebkitBoxShadow: 'rgba(0, 0, 0, 0.1) 0px 5px 5px',
          MozBoxShadow: 'rgba(0, 0, 0, 0.1) 0px 5px 5px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 5px 5px',
          backgroundColor: 'white',
          marginBottom: '5px'
        },
        error: {
          borderTop: '2px solid',
          WebkitBoxShadow: 'rgba(0, 0, 0, 0.1) 0px 5px 5px',
          MozBoxShadow: 'rgba(0, 0, 0, 0.1) 0px 5px 5px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 5px 5px',
          backgroundColor: '#F44336',
          color: '#ffffff',
          marginBottom: '5px'
        },
        warning: {
          borderTop: '0px solid',
          WebkitBoxShadow: 'rgba(0, 0, 0, 0.1) 0px 5px 5px',
          MozBoxShadow: 'rgba(0, 0, 0, 0.1) 0px 5px 5px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 5px 5px',
          backgroundColor: '#E65100',
          color: '#ffffff',
          marginBottom: '5px'
        }
      },
      Title: {
        error: {
          color: '#ffffff',
          fontWeight: 700
        },
        warning: {
          color: '#ffffff',
          fontWeight: 700
        }
      },
      Dismiss: {
        info: {
          backgroundColor: '',
          color: '#000000'
        },
        error: {
          backgroundColor: '',
          color: '#ffffff'
        },
        warning: {
          backgroundColor: '',
          color: '#ffffff'
        }
      }
    }
    return (
      <div>
        {this.props.app.appLoading ? (
          <div>
            <NotificationSystem
              ref={n => (this._notificationSystem = n)}
              style={notificationStyle}
            />
            <Router history={history}>
              <AppLoading />
            </Router>
          </div>
        ) : (
          <div>
            <NotificationSystem
              ref={n => (this._notificationSystem = n)}
              style={notificationStyle}
            />
            <Router history={history}>
              <Switch>
                <Route
                  exact
                  path={'/app/' + appHashPath + '/home'}
                  component={ApplicationHomePage}
                />
                <Route
                  path={'/app/' + appHashPath + '/vault'}
                  component={ApplicationVaultPage}
                />
                <Route
                  path={'/app/' + appHashPath + '/drago'}
                  component={ApplicationDragoPage}
                />
                <Route
                  path={'/app/' + appHashPath + '/exchange'}
                  component={ApplicationExchangePage}
                />
                <Route
                  path={'/app/' + appHashPath + '/config'}
                  component={ApplicationConfigPage}
                />
                <Redirect
                  from="/exchange/"
                  to={'/app/' + appHashPath + '/exchange'}
                />
                <Redirect
                  from="/vault/"
                  to={'/app/' + appHashPath + '/vault'}
                />
                <Redirect from="/drago" to={'/app/' + appHashPath + '/drago'} />
                <Redirect from="/" to={'/app/' + appHashPath + '/home'} />
                <Route component={Whoops404} />
              </Switch>
            </Router>
          </div>
        )}
      </div>
    )
  }

  notificationAlert = (primaryText, secondaryText, eventType = 'transfer') => {
    return (
      <MuiThemeProvider>
        <ElementNotification
          primaryText={primaryText}
          secondaryText={secondaryText}
          eventType={eventType}
          eventStatus="executed"
          txHash=""
        />
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps)(App)
