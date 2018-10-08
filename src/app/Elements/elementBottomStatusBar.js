import * as Colors from 'material-ui/styles/colors'
import { APP_VERSION } from '../_utils/const'
import { Col, Row } from 'react-flexbox-grid'
import AccessTime from 'material-ui/svg-icons/device/access-time'
import NotificationWifi from 'material-ui/svg-icons/notification/wifi'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import utils from '../_utils/utils'

import classnames from 'classnames'
import styles from './elementBottomStatusBar.module.css'

let t = null

export default class ElementBottomStatusBar extends Component {
  static propTypes = {
    // accountName: PropTypes.string.isRequired,
    blockNumber: PropTypes.string.isRequired,
    networkName: PropTypes.string.isRequired,
    networkError: PropTypes.string.isRequired,
    networkStatus: PropTypes.string.isRequired
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  state = {
    currentTime: '0000-00-00 00:00:00',
    lastBlockTime: '00:00:00'
  }

  componentDidMount() {
    this.startTime()
  }

  componentWillUnmount() {
    clearTimeout(t)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log(this.props.blockNumber)
    // console.log(nextProps.blockNumber)
    if (this.props.blockNumber == 0 && nextProps.blockNumber != 0) {
      // this.blockNumber(nextProps.blockNumber)
    }
    // (!utils.shallowEqual(this.props.blockNumber, nextProps.blockNumber)) ? this.blockNumber(): null
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsUpdate = !utils.shallowEqual(this.props, nextProps)
    const stateUpdate = !utils.shallowEqual(this.state, nextState)
    return propsUpdate || stateUpdate
  }

  renderNetworkStatus = () => {
    const { networkStatus, networkError } = this.props
    let networkIconColor = Colors.green600
    let toolTipType = 'info'
    switch (networkError) {
      case 'networkOk':
        networkIconColor = Colors.green600
        break
      case 'networkWarning':
        networkIconColor = Colors.red600
        break
      default:
        networkIconColor = Colors.green600
    }
    switch (networkError) {
      case 'networkOk':
        toolTipType = 'info'
        break
      case 'networkWarning':
        toolTipType = 'error'
        break
      default:
        toolTipType = 'info'
    }

    return (
      <a className={classnames(styles.tooltip)}>
        <NotificationWifi
          className={classnames(styles.networkIcon)}
          color={networkIconColor}
        />
        <div className={styles.tooltiptext}>{networkStatus}</div>
      </a>
    )
  }

  startTime = () => {
    let x = this
    function checkTime(i) {
      return i < 10 ? '0' + i : i
    }
    let today = new Date(),
      y = today.getFullYear(),
      M = ('0' + (today.getMonth() + 1)).slice(-2),
      d = ('0' + today.getDate()).slice(-2),
      h = checkTime(today.getHours()),
      m = checkTime(today.getMinutes()),
      s = checkTime(today.getSeconds())

    const currentTime = y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s
    this.setState({
      currentTime: currentTime
    })
    t = setTimeout(function() {
      x.startTime()
    }, 1000)
  }

  renderCurrentTime = () => {
    return (
      <span>
        <AccessTime className={classnames(styles.accessTimeIcon)} />
        &nbsp;
        {this.state.currentTime}
      </span>
    )
  }

  render() {
    const { blockNumber, networkName, networkStatus, networkError } = this.props
    let toolTipType = 'info'
    let networkClass = classnames(styles.networkName, styles[networkName])
    const numberWithCommas = x => {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    switch (networkError) {
      case 'networkOk':
        toolTipType = 'info'
        break
      case 'networkWarning':
        toolTipType = 'error'
        break
      default:
        toolTipType = 'info'
    }
    return (
      <Row className={styles.networkStatus} between="xs">
        <Col xs={6} className={styles.copyright}>
          ©2018 RigoBlock. All rights reserved. {APP_VERSION}
        </Col>
        <Col xs={6} className={styles.networkStatusCounter}>
          <div className={styles.networkDataContainer}>
            {this.renderCurrentTime()}
            &nbsp;&nbsp;&nbsp;&nbsp; Blockchain: #
            {numberWithCommas(blockNumber)}
            &nbsp;&nbsp;
            <span className={networkClass}>{networkName}</span>
            &nbsp;&nbsp;
            {this.renderNetworkStatus()}
          </div>
        </Col>
        <span>{networkStatus}</span>
      </Row>
    )
  }
}
