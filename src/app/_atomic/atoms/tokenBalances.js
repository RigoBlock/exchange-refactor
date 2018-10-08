// Copyright 2016-2017 Rigo Investment Sagl.

import { Col, Row } from 'react-flexbox-grid'
import { formatEth, toUnitAmount } from '../../_utils/format'
import BigNumber from 'bignumber.js'
import ContentLoader from 'react-content-loader'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './tokenBalances.module.css'

export default class TokenBalances extends Component {
  static propTypes = {
    liquidity: PropTypes.object.isRequired,
    selectedTradeTokensPair: PropTypes.object.isRequired,
    loading: PropTypes.bool
  }

  static defaultProps = {
    loading: false
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  renderAmount = amount => {
    return amount
    // return this.props.liquidity.loading
    //   ? // <div style={{ width: '100px' }}>
    //     //   <ContentLoader
    //     //     height={15}
    //     //     width={100}
    //     //     speed={2}
    //     //     primaryColor="#f3f3f3"
    //     //     secondaryColor="#ecebeb"
    //     //   >
    //     //     {/* <rect x="0" y="0" rx="5" ry="5" width="30" height="5" /> */}
    //     //   </ContentLoader>
    //     // </div>
    //     formatEth(0, 4, api)
    //   : amount
  }

  render() {
    const { liquidity, selectedTradeTokensPair } = this.props
    return (
      <div className={styles.balancesContainer}>
        <Row>
          <Col xs={12}>
            BALANCES:{' '}
            <span className={styles.amountText}>
              {toUnitAmount(
                new BigNumber(liquidity.baseToken.balance),
                selectedTradeTokensPair.baseToken.decimals
              ).toFixed(4)}{' '}
            </span>
            <small>{selectedTradeTokensPair.baseToken.symbol}</small>{' '}
            <span className={styles.amountText}>
              {toUnitAmount(
                new BigNumber(liquidity.quoteToken.balance),
                selectedTradeTokensPair.quoteToken.decimals
              ).toFixed(4)}{' '}
            </span>
            <small className={styles.symbolText}>
              {selectedTradeTokensPair.quoteToken.symbol}
            </small>{' '}
            {/* <span className={styles.amountText}>
              {toUnitAmount(new BigNumber(liquidity.ZRX), 18).toFixed(4)}{' '}
            </span>
            <small>ZRX</small> */}
          </Col>
        </Row>
      </div>
    )
  }
}
