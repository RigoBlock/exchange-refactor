import * as Colors from 'material-ui/styles/colors'
import { Actions } from '../../_redux/actions'
import { Col, Row } from 'react-flexbox-grid'
import {
  ERRORS,
  validateAccount,
  validateNewName,
  validateNewSymbol
} from '../../_utils/validation'
import { connect } from 'react-redux'
import AccountSelector from '../../Elements/elementAccountSelector'
import ActionsDialogHeader from '../../_atomic/molecules/actionsDialogHeader'
import ButtonDeployPool from '../../_atomic/atoms/buttonDeployPool'
import Dialog from 'material-ui/Dialog'
import ElementFundActionAuthorization from '../../Elements/elementActionAuthorization'
import FlatButton from 'material-ui/FlatButton'
import PoolApi from '../../PoolsApi/src'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from 'material-ui/TextField'

const customContentStyle = {
  minHeight: '500px'
}

function mapStateToProps(state) {
  return state
}

class ElementVaultCreateAction extends React.Component {
  static contextTypes = {
    api: PropTypes.object.isRequired,
    addTransactionToQueue: PropTypes.func
  }

  static propTypes = {
    // vaultDetails: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  state = {
    open: false,
    account: {},
    accountError: ERRORS.invalidAccount,
    amountError: ERRORS.invalidAmount,
    vaultName: '',
    vaultNameError: ERRORS.invalidName,
    vaultSymbol: '',
    vaultSymbolError: ERRORS.invalidSymbol,
    canSubmit: false,
    sending: false,
    complete: false,
    vaultDetails: ''
  }

  handleOpen = () => {
    console.log('open')
    this.setState({
      open: true,
      openAuth: false,
      authMsg: '',
      account: {},
      accountError: ERRORS.invalidAccount,
      vaultName: '',
      vaultNameError: ERRORS.invalidName,
      vaultSymbol: '',
      vaultSymbolError: ERRORS.invalidSymbol,
      canSubmit: false,
      sending: false,
      complete: false
    })
  }

  handleClose = () => {
    this.setState({
      open: false,
      openAuth: false,
      authMsg: '',
      account: {},
      accountError: ERRORS.invalidAccount,
      vaultName: '',
      vaultNameError: ERRORS.invalidName,
      vaultSymbol: '',
      vaultSymbolError: ERRORS.invalidSymbol,
      canSubmit: false,
      sending: false,
      complete: false
    })
  }

  handleSubmit = () => {
    this.setState({ openAuth: true })
  }

  onChangeAddress = account => {
    const { api } = this.context
    this.setState({
      account,
      accountError: validateAccount(account, api)
    })
  }

  onChangeName = (event, vaultName) => {
    this.setState({
      vaultName: vaultName,
      vaultNameError: validateNewName(vaultName)
    })
  }

  onChangeSymbol = (event, vaultSymbol) => {
    this.setState({
      vaultSymbol: vaultSymbol.toUpperCase(),
      vaultSymbolError: validateNewSymbol(vaultSymbol)
    })
  }

  onSend = () => {
    const { api } = this.context
    const vaultName = this.state.vaultName.toString()
    const vaultSymbol = this.state.vaultSymbol.toString()
    const vaultDetails = {
      name: vaultName,
      symbol: vaultSymbol
    }
    // Setting variables depending on account source
    let provider = this.state.account.source === 'MetaMask' ? window.web3 : api
    let poolApi = null
    // Initializing transaction variables
    const authMsg = 'You deployed the vault ' + vaultSymbol + ' | ' + vaultName
    const transactionId = api.util.sha3(new Date() + vaultSymbol)
    let transactionDetails = {
      status:
        this.state.account.source === 'MetaMask' ? 'pending' : 'authorization',
      hash: '',
      parityId: null,
      timestamp: new Date(),
      account: this.state.account,
      error: false,
      action: 'CreateVault',
      symbol: vaultSymbol,
      amount: ''
    }
    this.props.dispatch(
      Actions.transactions.addTransactionToQueueAction(
        transactionId,
        transactionDetails
      )
    )
    const { account } = this.state
    this.setState({
      sending: true
    })
    poolApi = new PoolApi(provider)
    poolApi.contract.vaultfactory.init().then(() => {
      poolApi.contract.vaultfactory
        .createVault(vaultName, vaultSymbol, this.state.account.address)
        .then(receipt => {
          console.log(receipt)
          // this.props.snackBar('Deploy awaiting for authorization')
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
            sending: false,
            complete: true
          })
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
    })
    this.setState(
      {
        authMsg: authMsg,
        authAccount: { ...this.state.account },
        sending: false,
        vaultDetails: vaultDetails
        // complete: true,
      },
      this.handleSubmit
    )
  }

  renderHeader = () => {
    return (
      <ActionsDialogHeader primaryText="Deploy new Vault" fundType="vault" />
    )
  }

  renderActions() {
    const { complete } = this.state

    if (complete) {
      return <FlatButton label="Done" primary onClick={this.handleClose} />
    }

    const {
      accountError,
      vaultNameError,
      vaultSymbolError,
      sending
    } = this.state
    const hasError = !!(accountError || vaultNameError || vaultSymbolError)

    return [
      <FlatButton
        key="CancelButton"
        label="Cancel"
        primary
        onClick={this.handleClose}
      />,
      <FlatButton
        key="SubmitButton"
        label="Deploy"
        primary
        disabled={hasError || sending}
        onClick={this.onSend}
      />
    ]
  }

  render() {
    const { openAuth, authMsg, authAccount, vaultDetails } = this.state
    const labelStyle = {
      color: '#FFFFFF',
      fontWeight: 700
    }
    const titleStyle = {
      padding: 0,
      lineHeight: '20px',
      fontSize: 16
    }

    const nameLabel = 'The name of your brand new vault'
    const symbolLabel = 'The symbol of your brand new vault'

    if (openAuth) {
      return (
        <div>
          <ButtonDeployPool handleOpen={this.handleOpen} fundType="vault" />
          <ElementFundActionAuthorization
            vaultDetails={vaultDetails}
            authMsg={authMsg}
            account={authAccount}
          />
        </div>
      )
    }

    return (
      <div>
        <ButtonDeployPool handleOpen={this.handleOpen} fundType="vault" />
        <Dialog
          title={this.renderHeader()}
          actions={this.renderActions()}
          modal={false}
          open={this.state.open}
          titleStyle={titleStyle}
          contentStyle={customContentStyle}
          onRequestClose={this.handleClose}
        >
          <Row>
            <Col xs={12}>
              <AccountSelector
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
              <TextField
                autoComplete="off"
                floatingLabelFixed
                floatingLabelText={nameLabel}
                fullWidth
                hintText="Vault name"
                name="name"
                id="name"
                errorText={this.state.vaultNameError}
                value={this.state.vaultName}
                onChange={this.onChangeName}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <TextField
                autoComplete="off"
                floatingLabelFixed
                floatingLabelText={symbolLabel}
                fullWidth
                hintText="Vault symbol (3 letters)"
                errorText={this.state.vaultSymbolError}
                name="symbol"
                id="symbol"
                value={this.state.vaultSymbol}
                onChange={this.onChangeSymbol}
              />
            </Col>
          </Row>
        </Dialog>
      </div>
    )
  }
}

export default connect(mapStateToProps)(ElementVaultCreateAction)
