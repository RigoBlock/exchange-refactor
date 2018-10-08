import { Col, Grid, Row } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ActionShowChart from 'material-ui/svg-icons/editor/show-chart'
import BigNumber from 'bignumber.js'
import ElementListFunds from '../Elements/elementListFunds'
import ElementListWrapper from '../../Elements/elementListWrapper'
import FilterFunds from '../Elements/elementFilterFunds'
import Paper from 'material-ui/Paper'
import PoolApi from '../../PoolsApi/src'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import UserDashboardHeader from '../../_atomic/atoms/userDashboardHeader'
import utils from '../../_utils/utils'

import styles from './pageSearchDragoTrader.module.css'

function mapStateToProps(state) {
  return state
}

class PageFundsDragoTrader extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    endpoint: PropTypes.object.isRequired
  }

  state = {
    dragoCreatedLogs: [],
    dragoFilteredList: []
  }

  scrollPosition = 0

  componentDidMount() {
    this.getDragos()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Updating the lists on each new block if the accounts balances have changed
    // Doing this this to improve performances by avoiding useless re-rendering

    const currentBalance = new BigNumber(this.props.endpoint.ethBalance)
    const nextBalance = new BigNumber(nextProps.endpoint.ethBalance)
    if (!currentBalance.eq(nextBalance)) {
      this.getDragos()
      console.log(
        `${
          this.constructor.name
        } -> UNSAFE_componentWillReceiveProps -> Accounts have changed.`
      )
    } else {
      null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let stateUpdate = true
    let propsUpdate = true
    const currentBalance = new BigNumber(this.props.endpoint.ethBalance)
    const nextBalance = new BigNumber(nextProps.endpoint.ethBalance)
    stateUpdate = !utils.shallowEqual(this.state, nextState)
    propsUpdate = !currentBalance.eq(nextBalance)
    if (stateUpdate || propsUpdate) {
      console.log(
        `${
          this.constructor.name
        } -> shouldComponentUpdate -> Proceedding with rendering.`
      )
    }
    return stateUpdate || propsUpdate
  }

  componentDidUpdate() {}

  filterList = filteredList => {
    this.setState({
      dragoFilteredList: filteredList
    })
  }

  render() {
    let { location } = this.props
    const { dragoCreatedLogs, dragoFilteredList } = this.state
    const detailsBox = {
      padding: 20
    }
    return (
      <Row>
        <Col xs={12}>
          <div className={styles.pageContainer}>
            <Paper zDepth={1}>
              <UserDashboardHeader
                fundType="drago"
                userType="funds"
                icon={<ActionShowChart />}
              />
            </Paper>
            <Paper zDepth={1}>
              <div className={styles.detailsBoxContainer}>
                <Grid fluid>
                  <Row className={styles.filterBox}>
                    <Col xs={12}>
                      <Paper style={detailsBox} zDepth={1}>
                        <FilterFunds
                          list={dragoCreatedLogs}
                          filterList={this.filterList}
                        />
                      </Paper>
                    </Col>
                  </Row>
                  <Row className={styles.transactionsStyle}>
                    <Col xs={12}>
                      <ElementListWrapper
                        list={dragoFilteredList}
                        location={location}
                        pagination={{
                          display: 10,
                          number: 1
                        }}
                      >
                        <ElementListFunds />
                      </ElementListWrapper>
                    </Col>
                  </Row>
                </Grid>
              </div>
            </Paper>
          </div>
        </Col>
      </Row>
    )
  }

  getDragos() {
    const { api } = this.context
    const poolApi = new PoolApi(api)
    const logToEvent = log => {
      // const key = api.util.sha3(JSON.stringify(log))
      const { params } = log
      return {
        symbol: params.symbol.value,
        dragoId: params.dragoId.value.toFixed(),
        name: params.name.value
      }
    }

    // Getting all DragoCreated events since block 0.
    // dragoFactoryEventsSignatures accesses the contract ABI, gets all the events and for each creates a hex signature
    // to be passed to getAllLogs. Events are indexed and filtered by topics
    // more at: http://solidity.readthedocs.io/en/develop/contracts.html?highlight=event#events
    poolApi.contract.dragoeventful.init().then(() => {
      poolApi.contract.dragoeventful
        .getAllLogs({
          topics: [poolApi.contract.dragoeventful.hexSignature.DragoCreated]
        })
        .then(dragoCreatedLogs => {
          const logs = dragoCreatedLogs.map(logToEvent)
          logs.sort(function(a, b) {
            if (a.symbol < b.symbol) return -1
            if (a.symbol > b.symbol) return 1
            return 0
          })
          this.setState({
            dragoCreatedLogs: logs,
            dragoFilteredList: logs
          })
        })
    })
  }
}

export default withRouter(connect(mapStateToProps)(PageFundsDragoTrader))
