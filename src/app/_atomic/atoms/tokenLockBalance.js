// Copyright 2016-2017 Rigo Investment Sagl.

import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class TokenLockBalance extends Component {
  static propTypes = {
    balance: PropTypes.string.isRequired,
    lockTime: PropTypes.string.isRequired
  }

  static defaultProps = {
    balance: 0,
    lockTime: '0'
  }
  render() {
    const now = Math.floor(Date.now() / 1000)
    console.log(now)
    console.log(this.props.lockTime)
    return now > Number(this.props.lockTime) ? (
      <span style={{ color: 'red' }}>{this.props.balance}</span>
    ) : (
      <span style={{ color: 'green' }}>{this.props.balance}</span>
    )
  }
}
