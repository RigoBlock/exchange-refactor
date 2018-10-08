// Copyright 2016-2017 Rigo Investment Sagl.

import { ETH, GRG } from '../../_utils/const'
import ImgETH from '../atoms/imgETH'
import ImgGRG from '../atoms/imgGRG'
import React, { Component } from 'react'

import styles from './selectTokenItem.module.css'

import PropTypes from 'prop-types'

export default class SelectTokenItem extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired
  }

  render() {
    const { account, token } = this.props

    let balance
    let tokenName
    switch (token) {
      case ETH:
        balance = account.ethBalance
        tokenName = 'Ethereum'
        break
      case GRG:
        balance = account.grgBalance
        tokenName = 'RigoBlock'
        break
      default:
        balance = account.ethBalance
        tokenName = 'Ethereum'
    }

    return (
      <div className={styles.logo}>
        <div className={styles.image}>
          {/* <IdentityIcon address={ account.address } /> */}
          {token === 'ETH' ? <ImgETH /> : <ImgGRG />}
        </div>
        <div className={styles.details}>
          <div className={styles.name}>{tokenName}</div>
          <div className={styles.balance}>
            {balance}
            <small> {token}</small>
          </div>
        </div>
      </div>
    )
  }
}
