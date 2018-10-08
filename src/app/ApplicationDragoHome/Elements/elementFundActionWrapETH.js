// Copyright 2016-2017 Rigo Investment Sagl.

import { Actions } from '../../_redux/actions'
import { Col, Row } from 'react-flexbox-grid'
import { Dialog, FlatButton, TextField } from 'material-ui'
import { ERC20_TOKENS } from '../../_utils/const'
import {
  ERRORS,
  validateAccount,
  validatePositiveNumber
} from '../../_utils/validation'
import { connect } from 'react-redux'
import ActionsDialogHeader from '../../_atomic/molecules/actionsDialogHeader'
import BigNumber from 'bignumber.js'
import DropDownMenu from 'material-ui/DropDownMenu'
import ElementFundActionAuthorization from '../../Elements/elementActionAuthorization'
import ImgETH from '../../_atomic/atoms/imgETH'
import MenuItem from 'material-ui/MenuItem'
import PoolApi from '../../PoolsApi/src'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import React, { Component } from 'react'

function mapStateToProps(state) {
  return state
}

class ElementFundActionWrapETH extends Component {
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
    openAuth: false,
    account: this.props.accounts[0],
    accountError: ERRORS.invalidAccount,
    amount: 0,
    amountError: ERRORS.invalidAmount,
    exchangeName: {},
    exchangeNameError: null, //ERRORS.invalidAccount,
    exchangeAddress: ' ',
    fundProxyContractAddress: '',
    action: 'wrap',
    sending: false,
    complete: false
  }

  buttonsStyle = {
    marginTop: 12,
    marginBottom: 12,
    color: 'white'
  }

  handleSubmit = () => {
    this.setState({ openAuth: true })
  }

  render() {
    const { complete } = this.state
    const { openAuth, authMsg, authAccount } = this.state
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
          {/* <RaisedButton label="Trade" primary={true} onClick={this.handleOpen}
            labelStyle={{ fontWeight: 700 }} /> */}
          <ElementFundActionAuthorization
            tokenDetails={dragoDetails}
            authMsg={authMsg}
            account={authAccount}
            onClose={this.handleCloseAuth}
          />
        </div>
      )
    }

    return (
      <Dialog
        title={this.renderHeader()}
        titleStyle={titleStyle}
        modal
        open={true}
        actions={this.renderActions()}
      >
        {this.renderFields()}
      </Dialog>
    )
  }

  renderHeader = () => {
    const { dragoDetails } = this.props
    return (
      <div>
        <ActionsDialogHeader
          primaryText="ETH Wrapper"
          fundType="drago"
          tokenDetails={dragoDetails}
        />
      </div>
    )
  }

  handleCloseAuth = () => {
    this.setState(
      {
        openAuth: false
      },
      this.onClose
    )
  }

  onClose = event => {
    // Calling callback function passed by parent in order to show/hide this dialog
    this.props.openActionForm(event, 'wrapETH')
  }

  renderActions() {
    const { amountError, sending } = this.state
    const hasError = !!amountError

    return [
      <FlatButton
        key="Cancel"
        label="Cancel"
        name="Cancel"
        primary
        onClick={this.onClose}
      />,
      <FlatButton
        key="Deposit"
        label={this.state.action}
        name="Deposit"
        primary
        disabled={hasError || sending}
        onClick={this.onSend}
      />
    ]
  }

  renderFields() {
    let amountLabel
    this.state.action === 'wrap'
      ? (amountLabel = 'The amount you want to wrap')
      : (amountLabel = 'The amount you want to un-wrap')

    return (
      <div>
        <Row middle="xs">
          <Col xs={1}>
            <ImgETH />
          </Col>
          <Col xs={11}>
            <DropDownMenu
              value={this.state.action}
              onChange={this.onChangeWrap}
            >
              <MenuItem value={'wrap'} primaryText="Wrap ETH" />
              <MenuItem value={'unwrap'} primaryText="Unwrap ETH" />
            </DropDownMenu>
          </Col>
        </Row>
        <Row middle="xs">
          <Col xs={10}>
            <TextField
              autoComplete="off"
              floatingLabelText={amountLabel}
              floatingLabelFixed
              fullWidth
              hintText={amountLabel}
              errorText={this.state.amountError}
              value={this.state.amount}
              onChange={this.onChangeAmount}
            />
          </Col>
          <Col xs={2}>
            <RaisedButton
              label="Maximum"
              secondary={true}
              // style={styles.button}
              // icon={<ActionSwapHoriz />}
              onClick={this.onMaximumAmount}
            />
          </Col>
        </Row>
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

  onChangeWrap = (event, index, action) => {
    this.setState({
      action
    })
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

  onMaximumAmount = () => {
    const amount =
      this.state.action === 'wrap'
        ? this.props.dragoDetails.dragoETHBalance
        : this.props.dragoDetails.dragoWETHBalance
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
    switch (this.state.action) {
      case 'wrap':
        this.onSendWrap()
        break
      case 'unwrap':
        this.onSendUnwrap()
        break
      default:
        return
    }
  }

  onSendUnwrap = () => {
    const { api } = this.context
    const { dragoDetails } = this.props
    // const { instance } = this.context;
    let poolApi = null
    const WETHaddress = ERC20_TOKENS[api._rb.network.name].WETH.address
    this.setState({
      sending: true
    })
    let provider = this.state.account.source === 'MetaMask' ? window.web3 : api
    const { account } = this.state
    const authMsg = 'You un-wrapped ' + this.state.amount + ' ETH'

    // Initializing transaction variables
    const transactionId = api.util.sha3(new Date() + account.address)
    let transactionDetails = {
      status: account.source === 'MetaMask' ? 'pending' : 'authorization',
      hash: '',
      parityId: null,
      timestamp: new Date(),
      account: account,
      error: false,
      action: 'UnWrapETH',
      symbol: 'ETH',
      amount: this.state.amount
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
      .withdrawFromExchange(
        WETHaddress,
        account.address,
        api.util.toWei(this.state.amount)
      )
      .then(receipt => {
        console.log(receipt)
        // Adding transaciont to the queue
        // Parity returns an internal transaction ID straighaway. The transaction then needs to be authorized inside the wallet.
        // MetaMask returns a receipt of the transaction once it has been mined by the network. It can take a long time.
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
    this.setState(
      {
        authMsg: authMsg,
        authAccount: { ...this.state.account }
        // sending: false,
        // complete: true,
      },
      this.handleSubmit
    )
  }

  onSendWrap = () => {
    const { api } = this.context
    const { dragoDetails } = this.props
    // const { instance } = this.context;
    let poolApi = null
    const WETHaddress = ERC20_TOKENS[api._rb.network.name].WETH.address
    this.setState({
      sending: true
    })
    let provider = this.state.account.source === 'MetaMask' ? window.web3 : api
    const { account } = this.state
    const authMsg = 'You wrapped ' + this.state.amount + ' ETH'

    // Initializing transaction variables
    const transactionId = api.util.sha3(new Date() + account.address)
    let transactionDetails = {
      status: account.source === 'MetaMask' ? 'pending' : 'authorization',
      hash: '',
      parityId: null,
      timestamp: new Date(),
      account: account,
      error: false,
      action: 'WrapETH',
      symbol: 'ETH',
      amount: this.state.amount
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
      .depositToExchange(
        WETHaddress,
        account.address,
        api.util.toWei(this.state.amount)
      )
      .then(receipt => {
        console.log(receipt)
        // Adding transaciont to the queue
        // Parity returns an internal transaction ID straighaway. The transaction then needs to be authorized inside the wallet.
        // MetaMask returns a receipt of the transaction once it has been mined by the network. It can take a long time.
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
        console.log(error)
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
    this.setState(
      {
        authMsg: authMsg,
        authAccount: { ...this.state.account }
        // sending: false,
        // complete: true,
      },
      this.handleSubmit
    )
  }
}

export default connect(mapStateToProps)(ElementFundActionWrapETH)
