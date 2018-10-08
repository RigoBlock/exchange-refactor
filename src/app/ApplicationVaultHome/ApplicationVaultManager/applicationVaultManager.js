import { Route, withRouter } from 'react-router-dom'
import PageDashboardVaultManager from './pageDashboardVaultManager'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
// import PageFundsDragoTrader from './pageFundsDragoTrader'
import PageVaultDetailsVaultManager from './pageVaultDetailsVaultManager'

import { Redirect, Switch } from 'react-router-dom'

class applicationVaultManager extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  }

  render() {
    const { accounts, match } = this.props
    return (
      <Switch>
        <Route
          path={match.path + '/dashboard'}
          render={props => (
            <PageDashboardVaultManager {...props} accounts={accounts} />
          )}
        />
        <Route
          path={match.path + '/pools/:dragoid/:dragocode'}
          render={props => (
            <PageVaultDetailsVaultManager {...props} accounts={accounts} />
          )}
        />
        <Redirect from={match.path} to={match.path + '/dashboard'} />
      </Switch>
    )
  }
}

export default withRouter(applicationVaultManager)
