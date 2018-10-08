// Copyright 2016-2017 Rigo Investment Sagl.

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './exchangeSelectItem.module.css'

export default class ExchangeItem extends Component {
  static propTypes = {
    exchange: PropTypes.object.isRequired
  }

  render() {
    const { exchange } = this.props

    return (
      <div className={styles.account}>
        <div className={styles.image}>
          <img src={'/img/' + exchange.icon} />
        </div>
        <div className={styles.details}>
          <div className={styles.name}>{exchange.name}</div>
        </div>
      </div>
    )
  }
}
