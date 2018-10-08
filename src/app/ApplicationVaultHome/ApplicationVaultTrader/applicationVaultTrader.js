import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import PageDashboardVaultTrader from './pageDashboardVaultTrader'
import PageSearchVaultTrader from './pageSearchVaultTrader'
import PageVaultDetailsVaultTrader from './pageVaultDetailsVaultTrader'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

class ApplicationVaultTrader extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  }

  render() {
    const { match } = this.props
    return (
      <Switch>
        <Route
          path={match.path + '/dashboard'}
          render={props => <PageDashboardVaultTrader {...props} />}
        />
        <Route
          exact
          path={match.path + '/pools'}
          render={props => <PageSearchVaultTrader {...props} />}
        />
        <Route
          path={match.path + '/pools/:dragoid/:dragocode'}
          render={props => <PageVaultDetailsVaultTrader {...props} />}
        />
        <Redirect from={match.path} to={match.path + '/dashboard'} />
      </Switch>
    )
  }
}

export default withRouter(ApplicationVaultTrader)
