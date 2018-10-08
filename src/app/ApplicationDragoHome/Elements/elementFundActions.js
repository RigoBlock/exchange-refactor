import * as Colors from 'material-ui/styles/colors'
import { Col, Row } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import ActionSwapHoriz from 'material-ui/svg-icons/action/swap-horiz'
import BigNumber from 'bignumber.js'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import React from 'react'
import TextField from 'material-ui/TextField'

import { Actions } from '../../_redux/actions'
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table'

import {
  ERRORS,
  validateAccount,
  validatePositiveNumber
} from '../../_utils/validation'
import { formatCoins } from '../../_utils/format'
import AccountSelector from '../../Elements/elementAccountSelector'
import ElementFundActionAuthorization from '../../Elements/elementActionAuthorization'
import ElementFundActionsHeader from './elementFundActionsHeader'
import PoolApi from '../../PoolsApi/src'

import styles from './elementFundActions.module.css'

const customContentStyle = {
  minHeight: '500px'
}

function mapStateToProps(state) {
  return state
}

class ElementFundActions extends React.Component {
  constructor(props) {
    super(props)
    if (this.props.actionSelected.action === 'buy') {
      this.state = {
        open: props.actionSelected.open,
        action: 'buy',
        amount: 0,
        actionSummary: 'BUYING',
        actionStyleBuySell: this.actionBuyStyle,
        switchButton: {
          label: 'Units',
          denomination: 'ETH',
          hint: 'Amount'
        },
        canSubmit: false,
        sending: false,
        complete: false,
        account: {},
        accountError: ERRORS.invalidAccount,
        accountCorrect: false,
        newDrgBalance: 0,
        drgBalance: 0,
        drgOrder: 0,
        amountError: ERRORS.invalidAmount,
        amountFieldDisabled: true,
        unitsSummary: 0,
        amountSummary: 0
      }
    } else {
      this.state = {
        open: props.actionSelected.open,
        action: 'sell',
        amount: 0,
        actionSummary: 'SELLING',
        actionStyleBuySell: this.actionSellStyle,
        switchButton: {
          label: 'Amount',
          denomination: this.props.dragoDetails.symbol,
          hint: 'Amount'
        },
        canSubmit: false,
        sending: false,
        complete: false,
        account: {},
        accountError: ERRORS.invalidAccount,
        accountCorrect: false,
        newDrgBalance: 0,
        drgBalance: 0,
        drgOrder: 0,
        amountError: ERRORS.invalidAmount,
        amountFieldDisabled: true,
        unitsSummary: 0,
        amountSummary: 0
      }
      this.state = {
        open: props.actionSelected.open,
        action: 'sell',
        amount: 0,
        actionSummary: 'SELLING',
        actionStyleBuySell: this.actionSellStyle,
        switchButton: {
          label: 'Amount',
          denomination: this.props.dragoDetails.symbol,
          hint: 'Amount'
        },
        canSubmit: false,
        sending: false,
        complete: false,
        account: {},
        accountError: ERRORS.invalidAccount,
        accountCorrect: false,
        newDrgBalance: 0,
        drgBalance: 0,
        drgOrder: 0,
        amountError: ERRORS.invalidAmount,
        amountFieldDisabled: true,
        unitsSummary: 0,
        amountSummary: 0
      }
    }
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    dragoDetails: PropTypes.object.isRequired,
    actionSelected: PropTypes.object,
    accounts: PropTypes.array.isRequired,
    onTransactionSent: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static defaultProps = {
    actionSelected: {
      open: false,
      action: 'buy'
    }
  }

  resetState = {
    openAuth: false,
    actionSummary: 'BUYING',
    account: {},
    accountError: ERRORS.invalidAccount,
    accountCorrect: false,
    amount: 0,
    newDrgBalance: 0,
    drgBalance: 0,
    drgOrder: 0,
    amountError: ERRORS.invalidAmount,
    amountFieldDisabled: true,
    unitsSummary: 0,
    amountSummary: 0,
    actionStyleBuySell: {
      color: Colors.green300
    },
    canSubmit: false,
    sending: false,
    complete: false,
    switchButton: {
      label: 'Units',
      denomination: 'ETH',
      hint: 'Amount'
    }
  }

  actionBuyStyle = {
    color: Colors.green300
  }

  actionSellStyle = {
    color: Colors.red300
  }

  UNSAFE_componentWillMount() {}

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log(nextProps)
    if (this.props.actionSelected.action !== nextProps.actionSelected.action) {
      nextProps.actionSelected.action === 'buy'
        ? this.handleBuyAction()
        : this.handleSellAction()
    }

    this.setState({
      open: nextProps.actionSelected.open
    })
  }

  handleOpen = () => {
    this.setState({
      open: true,
      ...this.resetState
    })
  }

  handleCloseAuth = () => {
    this.setState(
      {
        openAuth: false
      },
      this.handleCancel
    )
  }

  handleCancel = () => {
    this.setState(
      {
        open: false,
        ...this.resetState
      },
      this.props.onTransactionSent
    )
  }

  handleSubmit = () => {
    this.setState({ openAuth: true })
  }

  handleSellAction = () => {
    const { dragoDetails } = this.props
    return this.setState({
      open: true,
      action: 'sell',
      amount: 0,
      actionSummary: 'SELLING',
      actionStyleBuySell: this.actionSellStyle,
      switchButton: {
        label: 'Amount',
        denomination: dragoDetails.symbol,
        hint: 'Amount'
      },
      canSubmit: false,
      sending: false,
      complete: false,
      account: {},
      accountError: ERRORS.invalidAccount,
      accountCorrect: false,
      newDrgBalance: 0,
      drgBalance: 0,
      drgOrder: 0,
      amountError: ERRORS.invalidAmount,
      amountFieldDisabled: true,
      unitsSummary: 0,
      amountSummary: 0
    })
  }

  handleBuyAction = () => {
    return this.setState({
      open: true,
      action: 'buy',
      amount: 0,
      actionSummary: 'BUYING',
      actionStyleBuySell: this.actionBuyStyle,
      switchButton: {
        label: 'Units',
        denomination: 'ETH',
        hint: 'Amount'
      },
      canSubmit: false,
      sending: false,
      complete: false,
      account: {},
      accountError: ERRORS.invalidAccount,
      accountCorrect: false,
      newDrgBalance: 0,
      drgBalance: 0,
      drgOrder: 0,
      amountError: ERRORS.invalidAmount,
      amountFieldDisabled: true,
      unitsSummary: 0,
      amountSummary: 0
    })
  }

  onChangeAccounts = account => {
    const { api } = this.context
    const { dragoDetails } = this.props
    const accountError = validateAccount(account, api)
    // Setting variables depending on account source
    // var provider = account.source === 'MetaMask' ? window.web3 : api
    let provider = api
    this.setState(
      {
        account,
        accountError: accountError
      },
      this.validateOrder
    )

    // Getting the account balance if account passed validation
    if (!accountError) {
      const poolApi = new PoolApi(provider)
      poolApi.contract.drago.init(dragoDetails.address)
      poolApi.contract.drago.balanceOf(account.address).then(amount => {
        const drgBalance = formatCoins(amount, 4, api)
        this.setState({
          drgBalance,
          amountFieldDisabled: false
        })
      })
    }
  }

  calculateBalance = (error = false) => {
    const { action, drgBalance, amount } = this.state
    const { dragoDetails } = this.props
    const buyPrice = new BigNumber(dragoDetails.buyPrice)
    const sellPrice = new BigNumber(dragoDetails.sellPrice)
    const buyRatio =
      this.state.switchButton.label === 'Units'
        ? new BigNumber(1).div(buyPrice)
        : new BigNumber(1).times(buyPrice)
    const sellRatio =
      this.state.switchButton.label === 'Units'
        ? new BigNumber(1).div(sellPrice)
        : new BigNumber(1).times(sellPrice)
    const drgCurrent = new BigNumber(drgBalance)
    const ratio = action === 'buy' ? buyRatio : sellRatio
    const getAmounts = (action, amount) => {
      let orderAmount = null
      if (amount.length === 0) {
        orderAmount = new BigNumber(0)
      } else {
        orderAmount = isNaN(amount) ? new BigNumber(0) : new BigNumber(amount)
      }
      // Checking if the amount is expressed in ETH
      if (this.state.switchButton.label === 'Units') {
        // Buy in ETH amount
        let amountDRG = orderAmount.times(ratio)
        let amountETH = new BigNumber(amount)
        return { amountETH: amountETH, amountDRG: amountDRG }
      }
      // Checking if the amount is expressed in DRG
      if (this.state.switchButton.label === 'Amount') {
        // Buy in DRG units
        let amountDRG = orderAmount
        let amountETH = new BigNumber(amount).times(ratio)
        return { amountETH: amountETH, amountDRG: amountDRG }
      }
    }

    // First: checking if there was a previous error. If positive, reset the balances and return.
    if (error) {
      this.setState({
        newDrgBalance: new BigNumber(0).toFormat(4),
        drgOrder: new BigNumber(0).toFormat(4),
        amountSummary: 0
      })
      return
    }

    // Second: updating the state with the new balances
    let newDrgBalance =
      action === 'buy'
        ? getAmounts(action, amount).amountDRG.plus(drgCurrent)
        : drgCurrent.minus(getAmounts(action, amount).amountDRG)
    this.setState({
      newDrgBalance: newDrgBalance.toFormat(4),
      drgOrder: getAmounts(action, amount).amountDRG.toFormat(4),
      amountSummary: getAmounts(action, amount).amountETH.toFormat(4),
      unitsSummary: getAmounts(action, amount).amountDRG.toFormat(4),
      amountError: ''
    })
  }

  onChangeAmount = (event, amount) => {
    const accountError = validatePositiveNumber(amount.trim())
    this.setState(
      {
        amount: amount.trim(),
        amountError: accountError
      },
      this.validateOrder
    )
  }

  validateOrder = () => {
    const {
      account,
      accountError,
      amount,
      amountError,
      drgBalance,
      action
    } = this.state
    const { dragoDetails } = this.props
    const buyPrice = new BigNumber(dragoDetails.buyPrice)
    const sellPrice = new BigNumber(dragoDetails.sellPrice)
    const buyRatio = new BigNumber(1).div(buyPrice)
    const sellRatio = new BigNumber(1).div(sellPrice)
    const ratio = action === 'buy' ? buyRatio : sellRatio
    const calculateAmount = amount => {
      switch (this.state.switchButton.label) {
        case 'Units':
          return action === 'buy'
            ? new BigNumber(amount)
            : new BigNumber(amount).times(ratio)
        case 'Amount':
          return action === 'buy'
            ? new BigNumber(amount).div(ratio)
            : new BigNumber(amount)
        default:
          return null
      }
    }
    // First: checking if any error in the account or amount. If error then return.
    if (accountError || amountError) {
      this.setState(
        {
          drgOrder: new BigNumber(0).toFormat(4),
          unitsSummary: 0
        },
        this.calculateBalance(true)
      )
      return
    }
    // Second: checking if the account balance has enough ETH
    switch (this.state.action) {
      case 'buy':
        if (calculateAmount(amount).gt(account.ethBalance.replace(/,/g, ''))) {
          this.setState(
            {
              amountError: ERRORS.invalidTotal,
              drgOrder: new BigNumber(0).toFormat(4),
              unitsSummary: 0
            },
            this.calculateBalance(true)
          )
        } else {
          this.calculateBalance()
        }
        break
      case 'sell':
        if (calculateAmount(amount).gt(drgBalance)) {
          this.setState(
            {
              amountError: ERRORS.invalidTotal,
              drgOrder: new BigNumber(0).toFormat(4),
              unitsSummary: 0
            },
            this.calculateBalance(true)
          )
        } else {
          this.calculateBalance()
        }
        break
      default:
        return null
    }
  }

  onSendBuy = () => {
    const { api } = this.context
    const { dragoDetails } = this.props
    const { account } = this.state
    const amount = api.util.toWei(this.state.amountSummary).toString()
    const authMsg =
      'You bought ' +
      this.state.unitsSummary +
      ' units of ' +
      dragoDetails.symbol.toUpperCase() +
      ' for ' +
      this.state.amountSummary +
      ' ETH'
    const transactionId = api.util.sha3(new Date() + account.address)

    // Setting variables depending on account source
    let provider = account.source === 'MetaMask' ? window.web3 : api
    let poolApi = null

    // Initializing transaction variables
    let transactionDetails = {
      status: account.source === 'MetaMask' ? 'pending' : 'authorization',
      hash: '',
      parityId: null,
      timestamp: new Date(),
      account: account,
      error: false,
      action: 'BuyDrago',
      symbol: dragoDetails.symbol.toUpperCase(),
      amount: this.state.amountSummary
    }
    this.props.dispatch(
      Actions.transactions.addTransactionToQueueAction(
        transactionId,
        transactionDetails
      )
    )

    // Sending the transaction
    poolApi = new PoolApi(provider)
    poolApi.contract.drago.init(dragoDetails.address)
    poolApi.contract.drago
      .buyDrago(account.address, amount)
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
        const errorArray = error.message.split(/\r?\n/)
        this.props.dispatch(
          Actions.notifications.queueWarningNotification(errorArray[0])
        )
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
    this.setState(
      {
        authMsg: authMsg,
        authAccount: { ...this.state.account },
        // sending: false,
        complete: true
      },
      this.handleSubmit
    )
  }

  onSendSell = () => {
    const { api } = this.context
    const { dragoDetails } = this.props
    const DIVISOR = 10 ** 6 //dragos are divisible by 1 million
    const { account } = this.state
    const amount = new BigNumber(this.state.unitsSummary)
      .times(DIVISOR)
      .toFixed(0)
    const authMsg =
      'You sold ' +
      this.state.unitsSummary +
      ' units of ' +
      dragoDetails.symbol.toUpperCase() +
      ' for ' +
      this.state.amountSummary +
      ' ETH'
    const transactionId = api.util.sha3(new Date() + account.address)

    // Setting variables depending on account source
    let provider = account.source === 'MetaMask' ? window.web3 : api
    let poolApi = null

    // Initializing transaction variables
    let transactionDetails = {
      status: account.source === 'MetaMask' ? 'pending' : 'authorization',
      hash: '',
      parityId: null,
      timestamp: new Date(),
      account: account,
      error: false,
      action: 'SellDrago',
      symbol: dragoDetails.symbol.toUpperCase(),
      amount: this.state.amountSummary
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
      .sellDrago(account.address, amount)
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
        const errorArray = error.message.split(/\r?\n/)
        this.props.dispatch(
          Actions.notifications.queueWarningNotification(errorArray[0])
        )
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
    this.setState(
      {
        authMsg: authMsg,
        authAccount: { ...this.state.account },
        // sending: false,
        complete: true
      },
      this.handleSubmit
    )
  }

  onSend = () => {
    switch (this.state.action) {
      case 'buy':
        this.onSendBuy()
        break
      case 'sell':
        this.onSendSell()
        break
      default:
        return null
    }
  }

  unitsSwitch = () => {
    const { dragoDetails } = this.props
    this.setState({
      switchButton: {
        label: this.state.switchButton.label === 'Units' ? 'Amount' : 'Units',
        hint: this.state.switchButton.hint === 'Units' ? 'Amount' : 'Units',
        denomination:
          this.state.switchButton.denomination === 'ETH'
            ? dragoDetails.symbol
            : 'ETH'
      },
      amountError: ' '
    })
  }

  buyFields = () => {
    const floatingLabelTextAmount =
      this.state.switchButton.denomination === 'ETH'
        ? 'Amount in ' + this.state.switchButton.denomination
        : 'Units of ' + this.state.switchButton.denomination
    return (
      <Col xs={6}>
        <Row middle="xs">
          <Col xs={12}>
            <AccountSelector
              accounts={this.props.accounts}
              account={this.state.account}
              errorText={this.state.accountError}
              floatingLabelText="From account"
              hintText="The account the transaction will be made from"
              onSelect={this.onChangeAccounts}
            />
          </Col>
          <Col xs={6}>
            <TextField
              id="actionBuyAmount"
              autoComplete="off"
              floatingLabelFixed
              floatingLabelText={floatingLabelTextAmount}
              fullWidth
              hintText={this.state.switchButton.hint}
              errorText={this.state.amountError}
              name="amount"
              disabled={this.state.amountFieldDisabled}
              value={this.state.amount}
              onChange={this.onChangeAmount}
            />
          </Col>
          <Col xs={6}>
            <RaisedButton
              label={this.state.switchButton.label}
              secondary={true}
              style={styles.button}
              icon={<ActionSwapHoriz />}
              onClick={this.unitsSwitch}
            />
          </Col>
        </Row>
      </Col>
    )
  }

  sellFields = () => {
    const floatingLabelTextAmount =
      this.state.switchButton.denomination === 'ETH'
        ? 'Amount in ' + this.state.switchButton.denomination
        : 'Units of ' + this.state.switchButton.denomination
    return (
      <Col xs={6}>
        <Row middle="xs">
          <Col xs={12}>
            <AccountSelector
              id="actionAccount"
              accounts={this.props.accounts}
              account={this.state.account}
              errorText={this.state.accountError}
              floatingLabelText="From account"
              hintText="The account the transaction will be made from"
              onSelect={this.onChangeAccounts}
            />
          </Col>
          <Col xs={6}>
            <TextField
              id="actionSellAmount"
              autoComplete="off"
              floatingLabelFixed
              floatingLabelText={floatingLabelTextAmount}
              fullWidth
              hintText={this.state.switchButton.hint}
              errorText={this.state.amountError}
              name="amount"
              disabled={this.state.amountFieldDisabled}
              value={this.state.amount}
              onChange={this.onChangeAmount}
            />
          </Col>
          <Col xs={6}>
            <RaisedButton
              label={this.state.switchButton.label}
              secondary={true}
              style={styles.button}
              icon={<ActionSwapHoriz />}
              onClick={this.unitsSwitch}
            />
          </Col>
        </Row>
      </Col>
    )
  }

  holding = () => {
    const { newDrgBalance, drgBalance, drgOrder } = this.state
    const { dragoDetails } = this.props
    return (
      <Table selectable={false} className={styles.detailsTable}>
        <TableBody displayRowCheckbox={false}>
          <TableRow hoverable={false}>
            <TableRowColumn className={styles.detailsTableCell}>
              Current
            </TableRowColumn>
            {/* <TableRowColumn className={styles.detailsTableCell}></TableRowColumn> */}
            <TableRowColumn className={styles.detailsTableCell2}>
              {drgBalance} {dragoDetails.symbol}
            </TableRowColumn>
          </TableRow>
          <TableRow hoverable={false}>
            <TableRowColumn className={styles.detailsTableCell}>
              Order
            </TableRowColumn>
            {/* <TableRowColumn className={styles.detailsTableCell}></TableRowColumn> */}
            <TableRowColumn className={styles.detailsTableCell2}>
              {drgOrder} {dragoDetails.symbol}
            </TableRowColumn>
          </TableRow>
          <TableRow hoverable={false}>
            <TableRowColumn className={styles.detailsTableCell}>
              Expected*
            </TableRowColumn>
            {/* <TableRowColumn className={styles.detailsTableCell}></TableRowColumn> */}
            <TableRowColumn className={styles.detailsTableCell2}>
              {newDrgBalance} {dragoDetails.symbol}
            </TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  render() {
    const { dragoDetails } = this.props
    const { openAuth, authMsg, authAccount } = this.state
    const { sending } = this.state
    const hasError = !!(this.state.accountError || this.state.amountError)

    const actions = [
      <FlatButton
        key="CancelButton"
        label="Cancel"
        primary={true}
        onClick={this.handleCancel}
      />,
      <FlatButton
        key="SubmitButton"
        label="Submit"
        primary={true}
        disabled={hasError || sending}
        onClick={this.onSend}
      />
    ]

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
      <div>
        {/* <RaisedButton label="Trade" primary={true} onClick={this.handleOpen} 
          labelStyle={{fontWeight: 700, fontSize: '20px'}}/> */}
        <Dialog
          title={
            <ElementFundActionsHeader
              dragoDetails={dragoDetails}
              action={this.state.action}
              handleSellAction={this.handleSellAction}
              handleBuyAction={this.handleBuyAction}
            />
          }
          actions={actions}
          modal={false}
          open={this.state.open}
          contentStyle={customContentStyle}
          onRequestClose={this.handleCancel}
        >
          <Row>
            <Col xs={12}>
              <Row center="xs">
                <Col xs={6}>
                  <h2>
                    <span style={this.state.actionStyleBuySell}>
                      {this.state.action.toUpperCase()}
                    </span>
                    &nbsp;
                    {dragoDetails.symbol}{' '}
                    {this.state.action === 'buy'
                      ? dragoDetails.buyPrice
                      : dragoDetails.sellPrice}
                  </h2>
                </Col>
              </Row>
            </Col>
          </Row>
          <Paper className={styles.paperContainer} zDepth={1}>
            <Row>
              <Col xs={6}>
                <p>Holding</p>
              </Col>
              <Col xs={6}>
                <p>Order</p>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>{this.holding()}</Col>
              {this.state.action === 'buy'
                ? this.buyFields()
                : this.sellFields()}
            </Row>
          </Paper>
          <Row>
            <Col xs={12} className={styles.grossAmountWarning}>
              * Gross of fees
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Row center="xs">
                <Col xs={6}>
                  <h2>
                    <span style={this.state.actionStyleBuySell}>
                      {this.state.actionSummary}
                    </span>{' '}
                    <span className={styles.summary}>
                      {this.state.unitsSummary}
                    </span>{' '}
                    {dragoDetails.symbol}
                    <br />
                    FOR{' '}
                    <span className={styles.summary}>
                      {this.state.amountSummary}
                    </span>{' '}
                    ETH{' '}
                  </h2>
                </Col>
              </Row>
            </Col>
          </Row>
        </Dialog>
      </div>
    )
  }
}

export default connect(mapStateToProps)(ElementFundActions)
