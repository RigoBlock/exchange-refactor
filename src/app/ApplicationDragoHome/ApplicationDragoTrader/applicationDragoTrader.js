import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import PageDashboardDragoTrader from './pageDashboardDragoTrader'
import PageFundDetailsDragoTrader from './pageFundDetailsDragoTrader'
import PageFundsDragoTrader from './pageSearchDragoTrader'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

class applicationDragoTrader extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  }

  render() {
    const { match } = this.props
    return (
      <Switch>
        <Route
          exact
          path={match.path + '/dashboard'}
          render={props => <PageDashboardDragoTrader {...props} />}
        />
        <Route
          exact
          path={match.path + '/pools'}
          render={props => <PageFundsDragoTrader {...props} />}
        />
        <Route
          exact
          path={match.path + '/pools/:dragoid/:dragocode'}
          render={props => <PageFundDetailsDragoTrader {...props} />}
        />
        <Redirect from={match.path} to={match.path + '/dashboard'} />
      </Switch>
    )
  }
}

export default withRouter(applicationDragoTrader)
