// Copyright 2016-2017 Rigo Investment Sagl.

import { BigNumber } from 'bignumber.js'
import { Col, Row } from 'react-flexbox-grid'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classNames from 'classnames'
import styles from './tokenPrice.module.css'

import TokenIcon from './tokenIcon'

export default class TokenPrice extends Component {
  static propTypes = {
    selectedTradeTokensPair: PropTypes.object.isRequired,
    tokenPrice: PropTypes.string,
    priceVariation: PropTypes.string
  }

  static defaultProps = {
    tokenPrice: '0.000000',
    priceVariation: '0'
  }

  checkPrice = () => {
    const { priceVariation } = this.props
    if (new BigNumber(priceVariation).gt(0)) {
      return styles.priceIncreased
    }
    if (new BigNumber(priceVariation).lt(0)) {
      return styles.priceDecreased
    }
    if (new BigNumber(priceVariation).eq(0)) {
      return styles.priceNoVariation
    }
  }

  render() {
    const { tokenPrice, priceVariation, selectedTradeTokensPair } = this.props
    return (
      <div className={styles.symbol}>
        <div className={styles.image}>
          <div>
            <TokenIcon
              size={40}
              symbol={selectedTradeTokensPair.baseToken.symbol}
            />
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.name}>
            <Row>
              <Col xs={12}>
                <div className={classNames(styles.tokenPair)}>
                  <span className={styles.baseToken}>
                    {selectedTradeTokensPair.baseToken.symbol}
                  </span>{' '}
                  <span className={styles.quoteToken}>
                    / {selectedTradeTokensPair.quoteToken.symbol}
                  </span>
                </div>
              </Col>
              <Col xs={12}>
                <div className={classNames(styles.tokenPrice)}>
                  {tokenPrice}
                </div>
              </Col>
              <Col xs={12}>
                <div
                  className={classNames(
                    styles.priceVariation,
                    this.checkPrice()
                  )}
                >
                  {priceVariation + '%'}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}
