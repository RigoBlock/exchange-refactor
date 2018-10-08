// Copyright 2016-2017 Rigo Investment Sagl.

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TokenIcon from '../atoms/tokenIcon'
import styles from './exchangeSelectItem.module.css'

export default class ExchangeTokenSelectItem extends Component {
  static propTypes = {
    baseTokenSymbol: PropTypes.string.isRequired,
    quoteTokenSymbol: PropTypes.string.isRequired
  }

  render() {
    return (
      <div className={styles.account}>
        <div className={styles.image}>
          <div>
            <TokenIcon size={40} symbol={this.props.baseTokenSymbol} />
          </div>
        </div>
        <div className={styles.details}>
          <div className={styles.name}>
            {this.props.baseTokenSymbol + '/' + this.props.quoteTokenSymbol}
          </div>
        </div>
      </div>
    )
  }
}
