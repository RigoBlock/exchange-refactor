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
  //   return {
  //     count: state.count
  //   };
}

class ElementFundCreateAction extends React.Component {
  static contextTypes = {
    api: PropTypes.object.isRequired,
    addTransactionToQueue: PropTypes.func
  }

  static propTypes = {
    // dragoDetails: PropTypes.object.isRequired,
    accounts: PropTypes.array.isRequired,
    endpoint: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  state = {
    open: false,
    account: {},
    accountError: ERRORS.invalidAccount,
    amountError: ERRORS.invalidAmount,
    dragoName: '',
    dragoNameError: ERRORS.invalidName,
    dragoSymbol: '',
    dragoSymbolError: ERRORS.invalidSymbol,
    canSubmit: false,
    sending: false,
    complete: false,
    dragoDetails: ''
  }

  handleOpen = () => {
    console.log('open')
    this.setState({
      open: true,
      openAuth: false,
      authMsg: '',
      account: {},
      accountError: ERRORS.invalidAccount,
      dragoName: '',
      dragoNameError: ERRORS.invalidName,
      dragoSymbol: '',
      dragoSymbolError: ERRORS.invalidSymbol,
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
      dragoName: '',
      dragoNameError: ERRORS.invalidName,
      dragoSymbol: '',
      dragoSymbolError: ERRORS.invalidSymbol,
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

  onChangeName = (event, dragoName) => {
    this.setState({
      dragoName: dragoName,
      dragoNameError: validateNewName(dragoName)
    })
  }

  onChangeSymbol = (event, dragoSymbol) => {
    this.setState({
      dragoSymbol: dragoSymbol.toUpperCase(),
      dragoSymbolError: validateNewSymbol(dragoSymbol)
    })
  }

  onSend = () => {
    const { api } = this.context
    const dragoName = this.state.dragoName.toString()
    const dragoSymbol = this.state.dragoSymbol.toString()
    const dragoDetails = {
      name: dragoName,
      symbol: dragoSymbol
    }
    // Setting variables depending on account source
    let provider = this.state.account.source === 'MetaMask' ? window.web3 : api
    let poolApi = null
    // Initializing transaction variables
    const authMsg = 'You deployed the fund ' + dragoSymbol + ' | ' + dragoName
    const transactionId = api.util.sha3(new Date() + dragoSymbol)
    let transactionDetails = {
      status:
        this.state.account.source === 'MetaMask' ? 'pending' : 'authorization',
      hash: '',
      parityId: null,
      timestamp: new Date(),
      account: this.state.account,
      error: false,
      action: 'DragoCreated',
      symbol: dragoSymbol,
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
    console.log(dragoName)
    poolApi = new PoolApi(provider)
    poolApi.contract.dragofactory.init().then(() => {
      poolApi.contract.dragofactory
        .createDrago(dragoName, dragoSymbol, this.state.account.address)
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
            sending: false,
            complete: true
          })
        })
        .catch(error => {
          console.log(error)
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
        dragoDetails: dragoDetails
        // complete: true,
      },
      this.handleSubmit
    )
  }

  renderHeader = () => {
    return (
      <ActionsDialogHeader primaryText="Deploy new Drago" fundType="drago" />
    )
  }

  renderActions() {
    const { complete } = this.state

    if (complete) {
      return <FlatButton label="Done" primary onClick={this.handleClose} />
    }

    const {
      accountError,
      dragoNameError,
      dragoSymbolError,
      sending
    } = this.state
    const hasError = !!(accountError || dragoNameError || dragoSymbolError)

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
    const { endpoint } = this.props
    const { openAuth, authMsg, authAccount, dragoDetails } = this.state
    const titleStyle = {
      padding: 0,
      lineHeight: '20px',
      fontSize: 16
    }
    const nameLabel = 'The name of your brand new drago'
    const symbolLabel = 'The symbol of your brand new drago'

    if (openAuth) {
      return (
        <div>
          <ButtonDeployPool handleOpen={this.handleOpen} fundType="drago" />
          <ElementFundActionAuthorization
            dragoDetails={dragoDetails}
            authMsg={authMsg}
            account={authAccount}
          />
        </div>
      )
    }

    return (
      <div>
        <ButtonDeployPool handleOpen={this.handleOpen} fundType="drago" />
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
                accounts={endpoint.accounts}
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
                hintText="Drago name"
                name="name"
                id="name"
                errorText={this.state.dragoNameError}
                value={this.state.dragoName}
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
                hintText="Drago symbol (3 letters)"
                errorText={this.state.dragoSymbolError}
                name="symbol"
                id="symbol"
                value={this.state.dragoSymbol}
                onChange={this.onChangeSymbol}
              />
            </Col>
          </Row>
        </Dialog>
      </div>
    )
  }
}

export default connect(mapStateToProps)(ElementFundCreateAction)
