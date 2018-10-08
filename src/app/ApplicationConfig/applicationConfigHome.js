import { Col, Row } from 'react-flexbox-grid'
import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ElementBottomStatusBar from '../Elements/elementBottomStatusBar'
import LeftSideDrawerConfig from '../Elements/leftSideDrawerConfig'
import PageNetworkConfig from './pageNetworkConfig'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './applicationConfigHome.module.css'

function mapStateToProps(state) {
  return state
}

class ApplicationConfigHome extends Component {
  static propTypes = {
    endpoint: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  }

  render() {
    const { match, endpoint } = this.props
    console.log(this.props)
    return (
      <div>
        <Row className={styles.container}>
          <Col xs={2}>
            <LeftSideDrawerConfig location={this.props.location} />
          </Col>
          <Col xs={10}>
            <Switch>
              <Route
                path={match.path + '/network'}
                render={props => <PageNetworkConfig {...props} />}
              />
              <Redirect from={match.path} to={match.path + '/network'} />
            </Switch>
          </Col>
        </Row>
        <ElementBottomStatusBar
          blockNumber={endpoint.prevBlockNumber}
          networkName={endpoint.networkInfo.name}
          networkError={endpoint.networkError}
          networkStatus={endpoint.networkStatus}
        />
      </div>
    )
  }
}
export default withRouter(connect(mapStateToProps)(ApplicationConfigHome))
