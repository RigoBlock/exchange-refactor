// Copyright 2016-2017 Rigo Investment Sagl.

import ApplicationHome from '../ApplicationHome'
import ApplicationTopBar from './ApplicationTopBar'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { Col, Grid, Row } from 'react-flexbox-grid'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import { connect } from 'react-redux'
import ElementNotConnected from '../Elements/elementNotConnected'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import classNames from 'classnames'
import styles from './application.module.css'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#054186'
  },
  fontFamily: "'Muli', sans-serif",
  appBar: {
    height: 45,
    fontSize: '20px !important',
    backgroundColor: '#054186'
  }
})

function mapStateToProps(state) {
  return state
}

class ApplicationHomePage extends Component {
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

  UNSAFE_componentWillMount() {}

  componentWillUnmount() {}

  static propTypes = {
    location: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired
  }

  handleToggleNotifications = () => {
    this.setState({ notificationsOpen: !this.state.notificationsOpen })
  }

  render() {
    const { isSyncing, syncStatus, isConnected } = this.props.app
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
          <Row className={classNames(styles.content)}>
            <Col xs={12}>
              <ApplicationHome />
              {isConnected && !isSyncing ? null : (
                <ElementNotConnected
                  isSyncing={isSyncing}
                  syncStatus={syncStatus}
                />
              )}
            </Col>
          </Row>
        </Grid>
      </MuiThemeProvider>
    )
  }
}

export default connect(mapStateToProps)(ApplicationHomePage)
