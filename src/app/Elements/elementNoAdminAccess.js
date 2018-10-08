import { Col, Grid, Row } from 'react-flexbox-grid'
import { withRouter } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './elementNoAdminAccess.module.css'

import { connect } from 'react-redux'

function mapStateToProps(state) {
  return state
}

class ElementNoAdminAccess extends Component {
  // Checking the type of the context variable that we receive by the parent
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col xs={12} className={styles.detailsTabContent}>
            <Paper zDepth={1}>
              <AppBar
                title="DETAILS"
                showMenuIconButton={false}
                titleStyle={{ fontSize: 20 }}
              />
              <div className={styles.detailsTabContent}>
                <p>Access denied. Only the owner can access this page.</p>
              </div>
            </Paper>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default withRouter(connect(mapStateToProps)(ElementNoAdminAccess))
