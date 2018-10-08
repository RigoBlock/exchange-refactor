// Copyright 2016-2017 Rigo Investment Sagl.

import * as Colors from 'material-ui/styles/colors'
import { Actions } from '../../_redux/actions'
import { Col, Row } from 'react-flexbox-grid'
import { Dialog, FlatButton, TextField } from 'material-ui'
import {
  ERRORS,
  validateAccount,
  validatePositiveNumber
} from '../../_utils/validation'
import { connect } from 'react-redux'
import AccountSelector from '../../Elements/elementAccountSelector'
import ActionsDialogHeader from '../../_atomic/molecules/actionsDialogHeader'
import AppBar from 'material-ui/AppBar'
import BigNumber from 'bignumber.js'
import ElementFundActionAuthorization from '../../Elements/elementActionAuthorization'
import Paper from 'material-ui/Paper'
import PoolApi from '../../PoolsApi/src'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './elementVaultActionSetFees.module.css'

//TODO: add address exchange

class ElementVaultActionSetFees extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    accounts: PropTypes.array.isRequired,
    vaultDetails: PropTypes.object.isRequired,
    openActionForm: PropTypes.func.isRequired,
    snackBar: PropTypes.func,
    dispatch: PropTypes.func.isRequired
  }

  state = {
    account: {},
    openAuth: false,
    accountError: ERRORS.invalidAccount,
    amountError: null,
    price: this.props.vaultDetails.price,
    feesError: ERRORS.invalidPrices,
    sending: false,
    complete: false
  }

  buttonsStyle = {
    marginTop: 12,
    marginBottom: 12,
    color: 'white'
  }

  componentDidMount() {
    const { api } = this.context
    console.log(api)
  }

  render() {
    const { complete, openAuth, authMsg, authAccount } = this.state
    const { vaultDetails } = this.props

    if (complete) {
      return null
    }

    const titleStyle = {
      padding: 0,
      lineHeight: '20px',
      fontSize: 16
    }

    if (openAuth) {
      return (
        <div>
          <ElementFundActionAuthorization
            vaultDetails={vaultDetails}
            authMsg={authMsg}
            account={authAccount}
            onClose={this.onClose}
          />
        </div>
      )
    }

    return (
      <div key="setPriceDialoDiv">
        <Dialog
          key="setPriceDialog"
          title={this.renderHeader()}
          titleStyle={titleStyle}
          modal
          open={true}
          actions={this.renderActions()}
        >
          {this.renderFields()}
        </Dialog>
      </div>
    )
  }

  renderHeader = () => {
    const { vaultDetails } = this.props
    return (
      <div key="dialogHeader">
        <ActionsDialogHeader
          primaryText="Set Fees"
          fundType="vault"
          tokenDetails={vaultDetails}
        />
      </div>
    )
  }

  onClose = event => {
    // Calling callback function passed by parent in order to show/hide this dialog
    this.props.openActionForm(event, 'setFees')
  }

  renderActions = () => {
    const { complete } = this.state

    if (complete) {
      return (
        <FlatButton
          key="dialogButton1"
          label="Done"
          primary
          onClick={this.onClose}
        />
      )
    }

    const { accountError, amountError, sending } = this.state
    const hasError = !!(amountError || accountError)

    return [
      <FlatButton
        key="dialogButton1"
        label="Cancel"
        name="setPrice"
        primary
        onClick={this.onClose}
      />,
      <FlatButton
        key="dialogButton2"
        label="Save"
        primary
        disabled={hasError || sending}
        onClick={this.onSend}
      />
    ]
  }

  renderFields = () => {
    // const amountLabel = 'Please enter a value';
    const priceBoxHeader = {
      buy: {
        backgroundColor: Colors.green300
      },
      sell: {
        backgroundColor: Colors.red300
      }
    }

    const priceBoxHeaderTitleStyle = {
      padding: 0,
      textAlign: 'center',
      fontSize: 25,
      fontWeight: 600
    }

    return (
      <div key="inputFields">
        <Row>
          <Col xs={12}>
            <p>
              Fees are expressed in basis points and must be equal or higher
              than 0.01%.
            </p>
            <p>Fractions of basis points are not allowed.</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <AccountSelector
              key="accountSelector"
              accounts={this.props.accounts}
              account={this.state.account}
              errorText={this.state.accountError}
              floatingLabelText="From account"
              hintText="The account the transaction will be made from"
              onSelect={this.onChangeAddress}
            />
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <Paper zDepth={1}>
              <Row>
                <Col xs={4}>
                  <AppBar
                    title="FEES"
                    showMenuIconButton={false}
                    style={priceBoxHeader.buy}
                    titleStyle={priceBoxHeaderTitleStyle}
                  />
                  <div className={styles.currentPriceText}>
                    {isNaN(this.state.price) || this.state.price === ''
                      ? '-'
                      : this.state.price}{' '}
                    %
                  </div>
                </Col>
                <Col xs={8}>
                  <TextField
                    key="setFundFeeField"
                    autoComplete="off"
                    floatingLabelFixed
                    floatingLabelText="The fee for this Vault"
                    fullWidth
                    // hintText={amountLabel}
                    errorText={this.state.amountError}
                    name="setVaultPriceField"
                    id="setVaultPriceField"
                    value={this.props.vaultDetails.price}
                    onChange={this.onChangeAmount}
                  />
                </Col>
              </Row>
            </Paper>
          </Col>
        </Row>
      </div>
    )
  }

  onChangeAddress = account => {
    const { api } = this.context
    this.setState({
      account,
      accountError: validateAccount(account, api)
    })
  }

  onChangeAmount = (event, fee) => {
    if (fee === '') {
      this.setState({
        price: '',
        amountErrorSell: ERRORS.invalidAmount
      })
      return
    }
    if (fee === 0) {
      this.setState({
        price: fee
      })
      return
    }
    this.setState(
      {
        price: fee,
        amountError: validatePositiveNumber(fee)
      },
      this.validateMimimumFee
    )
  }

  validateMimimumFee = () => {
    const { price } = this.state
    let bn = null

    try {
      bn = new BigNumber(price)
    } catch (e) {
      this.setState({
        amountError: ERRORS.invalidAmount
      })
      return
    }
    if (bn.decimalPlaces() > 2) {
      this.setState({
        amountError: ERRORS.invalidAmountFractionBasisPoint
      })
      return
    }
    if (!bn.gte(0.01)) {
      this.setState({
        amountError: ERRORS.invalidAmountFeeTooLow
      })
    }
    if (bn.gte(1.0)) {
      this.setState({
        amountError: ERRORS.invalidAmountFeeTooHigh
      })
    }
  }

  onSend = () => {
    const { api } = this.context
    const { vaultDetails } = this.props
    const price = this.state.price
    const accountAddress = this.state.account.address
    let poolApi = null
    let provider = this.state.account.source === 'MetaMask' ? window.web3 : api
    this.setState({
      sending: true
    })
    const transactionId = api.util.sha3(new Date() + accountAddress)
    let transactionDetails = {
      status:
        this.state.account.source === 'MetaMask' ? 'pending' : 'authorization',
      hash: '',
      parityId: null,
      timestamp: new Date(),
      account: this.state.account,
      error: false,
      action: 'SetFeeVault',
      symbol: vaultDetails.symbol.toUpperCase(),
      amount: ''
    }
    this.props.dispatch(
      Actions.transactions.addTransactionToQueueAction(
        transactionId,
        transactionDetails
      )
    )
    const { account } = this.state

    // price must be in basis points. Mimimum fee = 0.01%, equal to price = 1
    poolApi = new PoolApi(provider)
    poolApi.contract.vault.init(vaultDetails.address)
    poolApi.contract.vault
      .setTransactionFee(this.state.account.address, price)
      .then(receipt => {
        console.log(receipt)
        if (account.source === 'MetaMask') {
          transactionDetails.status = 'executed'
          transactionDetails.receipt = receipt
          transactionDetails.hash = receipt.transactionHash
          transactionDetails.timestamp = new Date()
          this.props.dispatch(
            Actions.transactions.addTransactionToQueueAction(
              transactionId,
              transactionDetails
            )
          )
        } else {
          transactionDetails.parityId = receipt
          this.props.dispatch(
            Actions.transactions.addTransactionToQueueAction(
              transactionId,
              transactionDetails
            )
          )
        }
      })
      .catch(error => {
        const errorArray = error.message.split(/\r?\n/)
        this.props.snackBar(errorArray[0])
        transactionDetails.status = 'error'
        transactionDetails.error = errorArray[0]
        console.log(error)
        this.props.dispatch(
          Actions.transactions.addTransactionToQueueAction(
            transactionId,
            transactionDetails
          )
        )
        this.setState({
          sending: false
        })
      })
    this.setState({
      sending: false,
      openAuth: true,
      authMsg: 'Fees set to ' + price + ' %',
      authAccount: { ...this.state.account }
    })
    // this.onClose()
    // this.props.snackBar('Instruction awaiting for authorization')
  }
}

export default connect()(ElementVaultActionSetFees)
