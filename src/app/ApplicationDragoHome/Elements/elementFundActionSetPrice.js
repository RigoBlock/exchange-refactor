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
import styles from './elementFundActionSetPrice.module.css'

function mapStateToProps(state) {
  return state
}

class ElementFundActionSetPrice extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    accounts: PropTypes.array.isRequired,
    dragoDetails: PropTypes.object.isRequired,
    openActionForm: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  state = {
    account: {},
    openAuth: false,
    accountError: ERRORS.invalidAccount,
    // amountErrorBuy: ERRORS.invalidAmount,
    // amountErrorSell: ERRORS.invalidAmount,
    amountErrorBuy: null,
    amountErrorSell: null,
    buyPrice: this.props.dragoDetails.buyPrice,
    sellPrice: this.props.dragoDetails.sellPrice,
    pricesError: ERRORS.invalidPrices,
    sending: false,
    complete: false
  }

  buttonsStyle = {
    marginTop: 12,
    marginBottom: 12,
    color: 'white'
  }

  render() {
    const { complete, openAuth, authMsg, authAccount } = this.state
    const { dragoDetails } = this.props

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
            dragoDetails={dragoDetails}
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
    const { dragoDetails } = this.props
    return (
      <div key="dialogHeader">
        <ActionsDialogHeader
          primaryText="Set Price"
          fundType="drago"
          tokenDetails={dragoDetails}
        />
      </div>
    )
  }

  onClose = event => {
    // Calling callback function passed by parent in order to show/hide this dialog
    this.props.openActionForm(event, 'setPrice')
  }

  renderActions = () => {
    const { complete } = this.state

    if (complete) {
      return (
        <FlatButton
          key="dialoButton1"
          label="Done"
          primary
          onClick={this.props.onClose}
        />
      )
    }

    const {
      accountError,
      amountErrorBuy,
      amountErrorSell,
      sending
    } = this.state
    const hasError = !!(amountErrorBuy || amountErrorSell || accountError)

    return [
      <FlatButton
        key="dialoButton1"
        label="Cancel"
        name="setPrice"
        primary
        onClick={this.onClose}
      />,
      <FlatButton
        key="dialoButton2"
        label="Save"
        primary
        disabled={hasError || sending}
        onClick={this.onSend}
      />
    ]
  }

  renderFields = () => {
    const amountLabel = 'Please enter a value'
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
        <AccountSelector
          key="accountSelector"
          accounts={this.props.accounts}
          account={this.state.account}
          errorText={this.state.accountError}
          floatingLabelText="From account"
          hintText="The account the transaction will be made from"
          onSelect={this.onChangeAddress}
        />
        <Row>
          <Col xs={12}>
            <Paper zDepth={1}>
              <Row>
                <Col xs={4}>
                  <AppBar
                    title="BUY"
                    showMenuIconButton={false}
                    style={priceBoxHeader.buy}
                    titleStyle={priceBoxHeaderTitleStyle}
                  />
                  <div className={styles.currentPriceText}>
                    {isNaN(this.state.buyPrice) ? '-' : this.state.buyPrice} ETH
                  </div>
                </Col>
                <Col xs={8}>
                  <TextField
                    key="setFundBuyPriceField"
                    autoComplete="off"
                    floatingLabelFixed
                    floatingLabelText="The BUY price for this Drago"
                    fullWidth
                    hintText={amountLabel}
                    errorText={this.state.amountErrorBuy}
                    name="setFundBuyPriceField"
                    id="setFundBuyPriceField"
                    value={this.state.buyPrice}
                    onChange={this.onChangeBuyPrice}
                  />
                </Col>
              </Row>
            </Paper>
            <Paper zDepth={1}>
              <Row>
                <Col xs={4}>
                  <AppBar
                    title="SELL"
                    showMenuIconButton={false}
                    style={priceBoxHeader.sell}
                    titleStyle={priceBoxHeaderTitleStyle}
                  />
                  <div className={styles.currentPriceText}>
                    {this.state.sellPrice} ETH
                  </div>
                </Col>
                <Col xs={8}>
                  <TextField
                    key="setFundSellPriceField"
                    autoComplete="off"
                    floatingLabelFixed
                    floatingLabelText="The SELL price for this Drago"
                    fullWidth
                    hintText={amountLabel}
                    errorText={this.state.amountErrorSell}
                    name="setFundSellPriceField"
                    id="setFundSellPriceField"
                    value={this.state.sellPrice}
                    onChange={this.onChangeSellPrice}
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

  onChangeBuyPrice = (event, buyPrice) => {
    const { sellPrice } = this.state
    const error = validatePositiveNumber(buyPrice)
    console.log(buyPrice)
    if (buyPrice === '') {
      this.setState({
        buyPrice: '',
        amountErrorBuy: error
      })
      return
    }
    // Checking if a valid positive number
    if (error) {
      this.setState({
        buyPrice: buyPrice,
        amountErrorBuy: error
      })
    } else {
      if (validatePositiveNumber(sellPrice)) {
        this.setState({
          buyPrice: buyPrice,
          amountErrorBuy: error
        })
        return
      }
      // Checking if buyPrice >= sellPrice
      if (new BigNumber(buyPrice).gte(sellPrice)) {
        this.setState({
          buyPrice: buyPrice,
          amountErrorBuy: error
        })
      } else {
        this.setState({
          buyPrice: buyPrice,
          amountErrorBuy: ERRORS.invalidPrices
        })
      }
    }
  }

  onChangeSellPrice = (event, sellPrice) => {
    const { buyPrice } = this.state
    const error = validatePositiveNumber(sellPrice)
    console.log(sellPrice)
    if (sellPrice === '') {
      this.setState({
        sellPrice: '',
        amountErrorSell: error
      })
      return
    }
    // Checking if a valid positive number
    if (error) {
      this.setState({
        sellPrice: sellPrice,
        amountErrorSell: error
      })
    } else {
      if (validatePositiveNumber(buyPrice)) {
        this.setState({
          sellPrice: sellPrice,
          amountErrorSell: error
        })
        return
      }
      // Checking if buyPrice >= sellPrice
      if (new BigNumber(buyPrice).gte(sellPrice)) {
        this.setState({
          sellPrice: sellPrice,
          amountErrorSell: error
        })
      } else {
        this.setState({
          sellPrice: sellPrice,
          amountErrorSell: ERRORS.invalidPrices
        })
      }
    }
  }

  onSend = () => {
    const { api } = this.context
    const { dragoDetails } = this.props
    const { buyPrice, sellPrice } = this.state
    let poolApi = null
    this.setState({
      sending: true
    })
    let provider = this.state.account.source === 'MetaMask' ? window.web3 : api
    const { account } = this.state

    // Initializing transaction variables
    const transactionId = api.util.sha3(new Date() + account.address)
    let transactionDetails = {
      status: account.source === 'MetaMask' ? 'pending' : 'authorization',
      hash: '',
      parityId: null,
      timestamp: new Date(),
      account: account,
      error: false,
      action: 'SetPrice',
      symbol: dragoDetails.symbol,
      amount: '0'
    }
    this.props.dispatch(
      Actions.transactions.addTransactionToQueueAction(
        transactionId,
        transactionDetails
      )
    )

    poolApi = new PoolApi(provider)
    poolApi.contract.drago.init(dragoDetails.address)
    poolApi.contract.drago
      .setPrices(account.address, buyPrice, sellPrice)
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
        this.setState({
          sending: false
        })
      })
      .catch(error => {
        console.warn(error)
        const errorArray = error.message.split(/\r?\n/)
        this.props.dispatch(
          Actions.notifications.queueWarningNotification(errorArray[0])
        )
        transactionDetails.status = 'error'
        transactionDetails.error = errorArray[0]
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
      openAuth: true,
      authMsg:
        'BUY price set to ' +
        buyPrice +
        ' ETH. SELL price set to ' +
        sellPrice +
        ' ETH',
      authAccount: { ...account }
    })
    // this.onClose()
    // this.props.snackBar('Instruction awaiting for authorization')
  }
}

export default connect(mapStateToProps)(ElementFundActionSetPrice)
