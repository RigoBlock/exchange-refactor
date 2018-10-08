// Copyright 2016-2017 Rigo Investment Sagl.

import { Dialog, FlatButton, TextField } from 'material-ui'
import {
  ERRORS,
  validateAccount,
  validatePositiveNumber
} from '../../_utils/validation'
import AccountSelector from '../../Elements/elementAccountSelector'
import ActionsDialogHeader from '../../_atomic/molecules/actionsDialogHeader'
import BigNumber from 'bignumber.js'
import PoolApi from '../../PoolsApi/src'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

const NAME_ID = ' '
const ADDRESS_0 = '0x0000000000000000000000000000000000000000' //ADDRESS_0 is for ETH deposits

//TODO: add address exchange

export default class ElementVaultActionDeposit extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    accounts: PropTypes.array.isRequired,
    vaultDetails: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    snackBar: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  state = {
    open: this.props.open,
    account: {},
    accountError: ERRORS.invalidAccount,
    amount: 0,
    amountError: ERRORS.invalidAmount,
    value: 'default',
    sending: false,
    complete: false
  }

  buttonsStyle = {
    marginTop: 12,
    marginBottom: 12,
    color: 'white'
  }

  render() {
    const { complete } = this.state

    if (complete) {
      return null
    }

    const titleStyle = {
      padding: 0,
      lineHeight: '20px',
      fontSize: 16
    }
    console.log(this.props)
    return (
      <Dialog
        title={this.renderHeader()}
        titleStyle={titleStyle}
        modal
        open={this.props.open}
        actions={this.renderActions()}
      >
        {this.renderFields()}
      </Dialog>
    )
  }

  renderHeader = () => {
    const { vaultDetails } = this.props
    return (
      <ActionsDialogHeader
        primaryText="Deposit to vault"
        fundType="vault"
        tokenDetails={vaultDetails}
      />
    )
  }

  onClose = () => {
    this.setState({
      open: false
    })
  }

  renderActions() {
    const { complete } = this.state

    if (complete) {
      return <FlatButton label="Done" primary onClick={this.props.onClose} />
    }

    const { accountError, amountError, sending } = this.state
    const hasError = !!(amountError || accountError)

    return [
      <FlatButton
        key="CancelButton"
        label="Cancel"
        name="deposit"
        primary
        onClick={this.onClose}
      />,
      <FlatButton
        key="DepositButton"
        label="Deposit"
        primary
        disabled={hasError || sending}
        onClick={this.onSend}
      />
    ]
  }

  renderFields() {
    const amountLabel = 'The amount you want to deposit'

    return (
      <div>
        <AccountSelector
          accounts={this.props.accounts}
          account={this.state.account}
          errorText={this.state.accountError}
          floatingLabelText="From account"
          hintText="The account the transaction will be made from"
          onSelect={this.onChangeAddress}
        />
        <TextField
          autoComplete="off"
          floatingLabelFixed
          floatingLabelText="Amount you want to deposit"
          fullWidth
          hintText={amountLabel}
          errorText={this.state.amountError}
          name={NAME_ID}
          id={NAME_ID}
          value={this.state.amount}
          onChange={this.onChangeAmount}
        />
      </div>
    )
  }

  onChangeAddress = account => {
    const { api } = this.context
    this.setState(
      {
        account,
        accountError: validateAccount(account, api)
      },
      this.validateTotal
    )
  }

  onChangeAmount = (event, amount) => {
    this.setState(
      {
        amount,
        amountError: validatePositiveNumber(amount)
      },
      this.validateTotal
    )
  }

  validateTotal = () => {
    const { account, accountError, amount, amountError } = this.state

    if (accountError || amountError) {
      return
    }

    if (new BigNumber(amount).gt(account.ethBalance.replace(/,/g, ''))) {
      this.setState({
        amountError: ERRORS.invalidTotal
      })
    }
  }

  onSend = () => {
    const { api } = this.context
    const { vaultDetails } = this.props
    // const { instance } = this.context;
    const exchangeAddress = this.state.exchangeAddress //cfd exchange; //this.state.exchange;
    // const values = [exchangeAddress.toString(), ADDRESS_0, api.util.toWei(this.state.amount).toString()]; //this.state.account.address
    // const options = {
    //   from: this.state.account.address
    // };
    let poolApi = null

    this.setState({
      sending: true
    })
    if (this.state.account.source === 'MetaMask') {
      const web3 = window.web3
      poolApi = new PoolApi(web3)
      poolApi.contract.drago.init(vaultDetails.address)
      poolApi.contract.drago
        .depositToExchange(
          this.state.account.address,
          exchangeAddress.toString(),
          ADDRESS_0,
          api.util.toWei(this.state.amount).toString()
        )
        .then(result => {
          console.log(result)
          this.setState({
            sending: false
          })
        })
        .catch(error => {
          console.error('error', error)
          this.setState({
            sending: false
          })
        })
      this.onClose()
      this.props.snackBar('Deposit awaiting for authorization')
    } else {
      poolApi = new PoolApi(api)
      poolApi.contract.drago.init(vaultDetails.address)
      poolApi.contract.drago
        .depositToExchange(
          this.state.account.address,
          exchangeAddress.toString(),
          ADDRESS_0,
          api.util.toWei(this.state.amount).toString()
        )
        .then(() => {
          this.onClose()
          this.props.snackBar('Deposit awaiting for authorization')
        })
        .catch(error => {
          console.error('error', error)
          this.setState({
            sending: false
          })
        })
    }
  }
}
