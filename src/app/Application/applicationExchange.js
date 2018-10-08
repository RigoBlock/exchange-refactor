// Copyright 2016-2017 Rigo Investment Sagl.

import ApplicationExchangeHome from '../ApplicationExchangeHome'
import ApplicationTopBar from './ApplicationTopBar'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { Col, Grid, Row } from 'react-flexbox-grid'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import { connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// import TestComponent from '../_atomic/atoms/testComponent'
import WalletSetup from '../_atomic/organisms/walletSetup'
import classNames from 'classnames'
import styles from './application.module.css'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#054186'
  },
  fontFamily: "'Muli', sans-serif",
  appBar: {
    height: 45,
    fontSize: '20px !important'
  }
})

const muiThemeExchange = getMuiTheme({
  palette: {
    primary1Color: '#054186'
  },
  fontFamily: "'Muli', sans-serif",
  appBar: {
    height: 20,
    fontSize: '15px !important'
  }
})

function mapStateToProps(state) {
  return state
}

class ApplicationExchangePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notificationsOpen: false
    }
  }

  // Context
  static childContextTypes = {
    muiTheme: PropTypes.object
  }

  getChildContext() {
    return {
      muiTheme
    }
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  componentWillUnmount() {}

  static propTypes = {
    location: PropTypes.object.isRequired,
    endpoint: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired
  }

  handleToggleNotifications = () => {
    this.setState({ notificationsOpen: !this.state.notificationsOpen })
  }

  render() {
    const { notificationsOpen } = this.state
    const { location, endpoint } = this.props
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Grid fluid className={styles.maincontainer}>
          <Row>
            <Col xs={12}>
              <ApplicationTopBar
                handleTopBarSelectAccountType={
                  this.handleTopBarSelectAccountType
                }
                handleToggleNotifications={this.handleToggleNotifications}
              />
            </Col>
          </Row>
          <MuiThemeProvider muiTheme={muiThemeExchange}>
            {/* <Row className={classNames(styles.content)}>
              <Col xs={12}>
                <div style={{ textAlign: 'center', marginTop: '25px' }}>
                  Coming soon.
                </div>
              </Col>
            </Row> */}
            <Row>
              <Col xs={12}>
                {endpoint.accounts.length === 0 ||
                !endpoint.isMetaMaskNetworkCorrect ? (
                  <WalletSetup />
                ) : (
                  <div>
                    <ApplicationExchangeHome
                      key={'Exchange' + endpoint.lastMetaMaskUpdateTime}
                      location={location}
                      notificationsOpen={notificationsOpen}
                      handleToggleNotifications={this.handleToggleNotifications}
                    />
                  </div>
                )}
                {/* <div>
                  <img src="/img/ex.png" className={styles.comingSoonBlur} />
                </div> */}
              </Col>

              {/* <TestComponent
                      key={'test' + endpoint.lastMetaMaskUpdateTime}
                    /> */}
            </Row>
          </MuiThemeProvider>
        </Grid>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps)(ApplicationExchangePage)
