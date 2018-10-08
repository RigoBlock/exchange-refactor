// Copyright 2016-2017 Rigo Investment Sagl.

import { Col, Row } from 'react-flexbox-grid'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './tokenLiquidity.module.css'
// import BigNumber from 'bignumber.js';
import { formatEth } from '../../_utils/format'
import Loading from './loading'

export default class TokenLiquidity extends Component {
  static propTypes = {
    liquidity: PropTypes.object.isRequired,
    loading: PropTypes.bool
  }

  static defaultProps = {
    loading: true
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  render() {
    const { liquidity } = this.props
    const { api } = this.context
    return this.props.loading ? (
      <Row>
        <Col xs={12}>
          <div className={styles.sectionTitle}>Liquidity</div>
        </Col>
        <Col xs={12}>
          <Loading size={35} />
        </Col>
      </Row>
    ) : (
      <Row>
        <Col xs={12}>
          <div className={styles.sectionTitle}>Liquidity</div>
        </Col>
        <Col xs={12} style={{ fontSize: '14px' }}>
          {formatEth(liquidity.ETH, 4, api)} <small>ETH</small>
          <br />
        </Col>
        {/* <Col xs={12} style={{ fontSize: '14px' }}>
          {formatEth(liquidity.WETH, 4, api)} <small>WETH</small>
          <br />
        </Col> */}
        <Col xs={12} style={{ fontSize: '14px' }}>
          {formatEth(liquidity.ZRX, 4, api)} <small>ZRX</small>
          <br />
        </Col>
      </Row>
    )
  }
}
