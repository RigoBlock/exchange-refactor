import * as Colors from 'material-ui/styles/colors'
import { Col, Row } from 'react-flexbox-grid'
import LinearProgress from 'material-ui/LinearProgress'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import React, { Component } from 'react'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import styles from './elementAppLoading.module.css'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#054186'
  },
  appBar: {
    height: 45,
    fontSize: '20px !important'
  }
})

class AppLoading extends Component {
  renderNotConnected = () => {
    return (
      <div className={styles.divFullHeight}>
        <Row className={styles.loadingDiv}>
          <Col xs={12}>
            <Row>
              <Col xs={12} style={{ textAlign: 'center' }}>
                <img
                  src="/img/rb-logo-final.png"
                  className={styles.logoImg}
                  alt=""
                />
                <LinearProgress
                  mode="indeterminate"
                  color={Colors.blueGrey900}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        {this.renderNotConnected()}
      </MuiThemeProvider>
    )
  }
}

export default AppLoading
