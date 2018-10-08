import { Route, withRouter } from 'react-router-dom'
import PageDashboardDragoManager from './pageDashboardDragoManager'
import PageFundDetailsDragoManager from './pageFundDetailsDragoManager'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { Redirect, Switch } from 'react-router-dom'

class applicationDragoManager extends Component {
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
          render={props => <PageDashboardDragoManager {...props} />}
        />
        <Route
          path={match.path + '/pools/:dragoid/:dragocode'}
          render={props => <PageFundDetailsDragoManager {...props} />}
        />
        <Redirect from={match.path} to={match.path + '/dashboard'} />
      </Switch>
    )
  }
}

export default withRouter(applicationDragoManager)
