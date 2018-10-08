// Copyright 2016-2017 Rigo Investment Sagl.

import AccountItem from './elementAccountItem'

import { MenuItem, SelectField } from 'material-ui'
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

const NAME_ID = ' '
let lastSelectedAccount = {}

export default class AccountSelect extends Component {
  static propTypes = {
    accounts: PropTypes.array.isRequired,
    account: PropTypes.object,
    anyAccount: PropTypes.bool,
    gabBalance: PropTypes.bool,
    onSelect: PropTypes.func,
    errorText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    hintText: PropTypes.string
  }

  componentDidMount() {
    // this.props.onSelect(lastSelectedAccount);
  }

  render() {
    const {
      account,
      accounts,
      anyAccount,
      errorText,
      floatingLabelText,
      gabBalance,
      hintText
    } = this.props
    return (
      <SelectField
        autoComplete="off"
        floatingLabelFixed
        floatingLabelText={floatingLabelText}
        fullWidth
        hintText={hintText}
        errorText={errorText}
        name={NAME_ID}
        id={NAME_ID}
        value={account}
        onChange={this.onSelect}
        style={{ height: 90 }}
      >
        {renderAccounts(accounts, { anyAccount, gabBalance })}
      </SelectField>
    )
  }

  onSelect = (event, idx, account) => {
    lastSelectedAccount = account || {}

    this.props.onSelect(lastSelectedAccount)
  }
}

function isPositive(numberStr) {
  return new BigNumber(numberStr.replace(/,/g, '')).gt(0)
}

export function renderAccounts(accounts, options = {}) {
  return accounts
    .filter(account => {
      if (options.anyAccount) {
        return true
      }
      return isPositive(
        account[options.gabBalance ? 'gabBalance' : 'ethBalance']
      )
    })
    .map(account => {
      const item = (
        <AccountItem
          account={account}
          key={account.address}
          gabBalance={options.gabBalance || false}
        />
      )

      return (
        <MenuItem key={account.address} value={account} label={item}>
          {item}
        </MenuItem>
      )
    })
}
