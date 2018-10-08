// Copyright 2016-2017 Rigo Investment Sagl.

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './tokenIcon.module.css'

export default class TokenIcon extends Component {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    size: PropTypes.number,
    color: PropTypes.bool
  }

  static defaultProps = {
    size: 32,
    color: true
  }
  render() {
    return (
      <img
        className={styles.iconImg}
        style={{ verticalAlign: 'middle' }}
        height={'' + this.props.size + 'px'}
        alt="token-icon"
        src={
          '/img/crypto-icons/color/' +
          this.props.symbol.toLowerCase() +
          '@2x.png'
        }
      />
    )
  }
}
