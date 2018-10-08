import * as Colors from 'material-ui/styles/colors'
import { Col, Row } from 'react-flexbox-grid'
import ActionSwapHoriz from 'material-ui/svg-icons/action/swap-horiz'
import BigNumber from 'bignumber.js'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import React from 'react'
import TextField from 'material-ui/TextField'

import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table'

import {
  ERRORS,
  validateAccount,
  validatePositiveNumber
} from '../../_utils/validation'
import { formatCoins } from '../../_utils/format'
import AccountSelector from '../../Elements/elementAccountSelector'
import ElementFundActionAuthorization from '../../Elements/elementActionAuthorization'
import ElementVaultActionsHeader from './elementVaultActionsHeader'
import PoolApi from '../../PoolsApi/src'

import { Actions } from '../../_redux/actions'
import { connect } from 'react-redux'
import styles from './elementVaultActions.module.css'

const customContentStyle = {
  minHeight: '500px'
}

const zeroAmount = new BigNumber(0).toFormat(4)

function mapStateToProps(state) {
  return state
}

class ElementVaultActions extends React.Component {
  constructor(props) {
    super(props)
    if (this.props.actionSelected.action === 'deposit') {
      this.state = {
        open: props.actionSelected.open,
        action: 'deposit',
        amount: zeroAmount,
        actionSummary: 'SENDING',
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
        newDrgBalance: zeroAmount,
        drgBalance: zeroAmount,
        drgOrder: zeroAmount,
        amountError: ERRORS.invalidAmount,
        amountFieldDisabled: true,
        unitsSummary: zeroAmount,
        amountSummary: zeroAmount
      }
    } else {
      this.state = {
        open: props.actionSelected.open,
        action: 'withdraw',
        amount: zeroAmount,
        actionSummary: 'WITHDRAWING',
        actionStyleBuySell: this.actionSellStyle,
        switchButton: {
          label: 'Amount',
          denomination: this.props.vaultDetails.symbol,
          hint: 'Amount'
        },
        canSubmit: false,
        sending: false,
        complete: false,
        account: {},
        accountError: ERRORS.invalidAccount,
        accountCorrect: false,
        newDrgBalance: zeroAmount,
        drgBalance: zeroAmount,
        drgOrder: zeroAmount,
        amountError: ERRORS.invalidAmount,
        amountFieldDisabled: true,
        unitsSummary: zeroAmount,
        amountSummary: zeroAmount
      }
    }
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    vaultDetails: PropTypes.object.isRequired,
    actionSelected: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    onTransactionSent: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    snackBar: PropTypes.func.isRequired
  }

  static defaultProps = {
    actionSelected: {
      open: false,
      action: 'deposit'
    }
  }

  resetState = {
    openAuth: false,
    actionSummary: 'SENDING',
    account: {},
    accountError: ERRORS.invalidAccount,
    accountCorrect: false,
    amount: zeroAmount,
    newDrgBalance: zeroAmount,
    drgBalance: zeroAmount,
    drgOrder: zeroAmount,
    amountError: ERRORS.invalidAmount,
    amountFieldDisabled: true,
    unitsSummary: zeroAmount,
    amountSummary: zeroAmount,
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
    if (this.props.actionSelected.action !== nextProps.actionSelected.action) {
      nextProps.actionSelected.action === 'deposit'
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
    const { vaultDetails } = this.props
    return this.setState({
      open: true,
      action: 'withdraw',
      amount: zeroAmount,
      actionSummary: 'WITHDRAWING',
      actionStyleBuySell: this.actionSellStyle,
      switchButton: {
        label: 'Amount',
        denomination: vaultDetails.symbol,
        hint: 'Amount'
      },
      canSubmit: false,
      sending: false,
      complete: false,
      account: {},
      accountError: ERRORS.invalidAccount,
      accountCorrect: false,
      newDrgBalance: zeroAmount,
      drgBalance: zeroAmount,
      drgOrder: zeroAmount,
      amountError: ERRORS.invalidAmount,
      amountFieldDisabled: true,
      unitsSummary: zeroAmount,
      amountSummary: zeroAmount
    })
  }

  handleBuyAction = () => {
    return this.setState({
      open: true,
      action: 'deposit',
      amount: zeroAmount,
      actionSummary: 'SENDING',
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
      newDrgBalance: zeroAmount,
      drgBalance: zeroAmount,
      drgOrder: zeroAmount,
      amountError: ERRORS.invalidAmount,
      amountFieldDisabled: true,
      unitsSummary: zeroAmount,
      amountSummary: zeroAmount
    })
  }

  onChangeAccounts = account => {
    const { api } = this.context
    const { vaultDetails } = this.props
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
      console.log(vaultDetails.address)
      poolApi.contract.vault.init(vaultDetails.address)
      console.log(poolApi.contract.vault.balanceOf(account.address))
      poolApi.contract.vault.balanceOf(account.address).then(amount => {
        console.log(amount)
        const drgBalance = formatCoins(new BigNumber(amount), 4, api)
        this.setState({
          drgBalance,
          amountFieldDisabled: false
        })
      })
      // const instance = api.newContract(abis.drago, vaultDetails.address).instance;
      // instance.balanceOf.call({}, [account.address])
      // .then((amount) =>{
      //   const drgBalance = formatCoins(amount,4,api)
      //   this.setState({
      //     drgBalance,
      //     amountFieldDisabled: false
      //   });
      // })
    }
  }

  calculateBalance = (error = false) => {
    const { action, drgBalance, amount } = this.state
    const { vaultDetails } = this.props
    const buyPrice = new BigNumber(vaultDetails.buyPrice)
    const sellPrice = new BigNumber(vaultDetails.sellPrice)
    const buyRatio =
      this.state.switchButton.label === 'Units'
        ? new BigNumber(1).div(buyPrice)
        : new BigNumber(1).times(buyPrice)
    const sellRatio =
      this.state.switchButton.label === 'Units'
        ? new BigNumber(1).div(sellPrice)
        : new BigNumber(1).times(sellPrice)
    const drgCurrent = new BigNumber(drgBalance)
    const ratio = action === 'deposit' ? buyRatio : sellRatio
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
      action === 'deposit'
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
    const { vaultDetails } = this.props
    const buyPrice = new BigNumber(vaultDetails.buyPrice)
    const sellPrice = new BigNumber(vaultDetails.sellPrice)
    const buyRatio = new BigNumber(1).div(buyPrice)
    const sellRatio = new BigNumber(1).div(sellPrice)
    const ratio = action === 'deposit' ? buyRatio : sellRatio
    const calculateAmount = amount => {
      switch (this.state.switchButton.label) {
        case 'Units':
          return action === 'deposit'
            ? new BigNumber(amount)
            : new BigNumber(amount).times(ratio)
        case 'Amount':
          return action === 'deposit'
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
      case 'deposit':
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
      case 'withdraw':
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
    const { vaultDetails } = this.props
    const accountAddress = this.state.account.address
    const amount = api.util.toWei(this.state.amountSummary).toString()
    const authMsg =
      'You sent ' +
      this.state.amountSummary +
      ' ETH to the vault ' +
      vaultDetails.symbol.toUpperCase()
    const transactionId = api.util.sha3(new Date() + accountAddress)
    // Setting variables depending on account source
    let provider = this.state.account.source === 'MetaMask' ? window.web3 : api
    let poolApi = null
    // Initializing transaction variables
    let transactionDetails = {
      status:
        this.state.account.source === 'MetaMask' ? 'pending' : 'authorization',
      hash: '',
      parityId: null,
      timestamp: new Date(),
      account: this.state.account,
      error: false,
      action: 'BuyVault',
      symbol: vaultDetails.symbol.toUpperCase(),
      amount: this.state.amountSummary
    }
    this.props.dispatch(
      Actions.transactions.addTransactionToQueueAction(
        transactionId,
        transactionDetails
      )
    )
    const { account } = this.state

    // Sending the transaction
    poolApi = new PoolApi(provider)
    poolApi.contract.vault.init(vaultDetails.address)
    poolApi.contract.vault
      .buyVault(accountAddress, amount)
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
    this.setState(
      {
        authMsg: authMsg,
        authAccount: { ...this.state.account },
        sending: false,
        complete: true
      },
      this.handleSubmit
    )
  }

  onSendSell = () => {
    const { api } = this.context
    const { vaultDetails } = this.props
    const DIVISOR = 10 ** 6 //dragos are divisible by 1 million
    const accountAddress = this.state.account.address
    const amount = new BigNumber(this.state.unitsSummary)
      .times(DIVISOR)
      .toFixed(0)
    const authMsg =
      'You withdrew ' +
      this.state.amountSummary +
      ' ETH from the vault ' +
      vaultDetails.symbol.toUpperCase()
    const transactionId = api.util.sha3(new Date() + accountAddress)
    // Setting variables depending on account source
    let provider = this.state.account.source === 'MetaMask' ? window.web3 : api
    let poolApi = null
    // Initializing transaction variables
    let transactionDetails = {
      status:
        this.state.account.source === 'MetaMask' ? 'pending' : 'authorization',
      hash: '',
      parityId: null,
      timestamp: new Date(),
      account: this.state.account,
      error: false,
      action: 'SellVault',
      symbol: vaultDetails.symbol.toUpperCase(),
      amount: this.state.amountSummary
    }

    this.props.dispatch(
      Actions.transactions.addTransactionToQueueAction(
        transactionId,
        transactionDetails
      )
    )
    const { account } = this.state

    // Sending the transaction
    poolApi = new PoolApi(provider)
    poolApi.contract.vault.init(vaultDetails.address)
    poolApi.contract.vault
      .sellVault(accountAddress, amount)
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
    // this.props.snackBar('Sell order waiting for authorization for ' + this.state.amountSummary + ' ' + vaultDetails.symbol.toUpperCase())
    this.setState(
      {
        authMsg: authMsg,
        authAccount: { ...this.state.account },
        sending: false,
        complete: true
      },
      this.handleSubmit
    )
  }

  onSend = () => {
    switch (this.state.action) {
      case 'deposit':
        this.onSendBuy()
        break
      case 'withdraw':
        this.onSendSell()
        break
      default:
        return null
    }
  }

  unitsSwitch = () => {
    const { vaultDetails } = this.props
    this.setState({
      switchButton: {
        label: this.state.switchButton.label === 'Units' ? 'Amount' : 'Units',
        hint: this.state.switchButton.hint === 'Units' ? 'Amount' : 'Units',
        denomination:
          this.state.switchButton.denomination === 'ETH'
            ? vaultDetails.symbol
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
    const { vaultDetails } = this.props

    return (
      <Table selectable={false} className={styles.detailsTable}>
        <TableBody displayRowCheckbox={false}>
          <TableRow hoverable={false}>
            <TableRowColumn className={styles.detailsTableCell}>
              Current
            </TableRowColumn>
            <TableRowColumn className={styles.detailsTableCell2}>
              {drgBalance} ETH
            </TableRowColumn>
          </TableRow>
          <TableRow hoverable={false}>
            <TableRowColumn className={styles.detailsTableCell}>
              Order
            </TableRowColumn>
            <TableRowColumn className={styles.detailsTableCell2}>
              {drgOrder} ETH
            </TableRowColumn>
          </TableRow>
          <TableRow hoverable={false}>
            <TableRowColumn className={styles.detailsTableCell}>
              Fee
            </TableRowColumn>
            <TableRowColumn className={styles.detailsTableCell2}>
              {new BigNumber(
                String((drgOrder * vaultDetails.fee) / 100)
              ).toFixed(4)}{' '}
              ETH
            </TableRowColumn>
          </TableRow>
          <TableRow hoverable={false}>
            <TableRowColumn className={styles.detailsTableCell}>
              Expected*
            </TableRowColumn>
            <TableRowColumn className={styles.detailsTableCell2}>
              {new BigNumber(
                String(newDrgBalance - (drgOrder * vaultDetails.fee) / 100)
              ).toFixed(4)}{' '}
              ETH
            </TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  render() {
    const { vaultDetails } = this.props
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
      console.log(vaultDetails)
      return (
        <div>
          {/* <RaisedButton label="Trade" primary={true} onClick={this.handleOpen}
            labelStyle={{ fontWeight: 700 }} /> */}
          <ElementFundActionAuthorization
            tokenDetails={vaultDetails}
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
            <ElementVaultActionsHeader
              vaultDetails={vaultDetails}
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
                    &nbsp;FEE&nbsp;
                    <span className={styles.summary}>{vaultDetails.fee}</span>
                    &nbsp;%
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
              {this.state.action === 'deposit'
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
                    ETH
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

export default connect(mapStateToProps)(ElementVaultActions)
