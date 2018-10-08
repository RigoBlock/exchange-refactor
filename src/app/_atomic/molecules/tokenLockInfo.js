import { Actions } from '../../_redux/actions'
import { Col, Row } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import { formatEth, toUnitAmount } from '../../_utils/format'
import { sha3_512 } from 'js-sha3'
import { toBaseUnitAmount } from '../../_utils/format'
import BigNumber from 'bignumber.js'
import ButtonLock from '../atoms/buttonLock'
import Checkbox from 'material-ui/Checkbox'
import LockErrorMessage from '../atoms/lockErrorMessage'
import PoolApi from '../../PoolsApi/src'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import SectionTitleExchange from '../atoms/sectionTitleExchange'
import TokenAmountInputField from '../atoms/tokenLockAmountField'
import TokenLockBalance from '../atoms/tokenLockBalance'
import TokenLockTimeField from '../atoms/tokenLockTimeField'
import serializeError from 'serialize-error'
import utils from '../../_utils/utils'

import styles from './tokenLockInfo.module.css'
// import utils from '../../_utils/utils'

class TokenLockInfo extends PureComponent {
  static propTypes = {
    selectedFund: PropTypes.object.isRequired,
    selectedExchange: PropTypes.object.isRequired,
    selectedTokensPair: PropTypes.object.isRequired,
    selectedRelay: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
    // notifications: PropTypes.func.isRequired
  }

  static defaultProps = {}

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  state = {
    baseTokenLockAmount: '0.01',
    quoteTokenLockAmount: '0.01',
    baseTokenLockTime: '1',
    quoteTokenLockTime: '1',
    baseTokenSelected: true,
    errorText: ''
  }

  isBalanceSufficient = (amount, liquidity) => {
    return new BigNumber(liquidity).gte(new BigNumber(amount))
  }

  componentDidMount = async () => {}

  onLockTocken = async action => {
    const {
      selectedFund,
      selectedTokensPair,
      selectedRelay,
      selectedExchange
    } = this.props
    const {
      baseTokenSelected,
      baseTokenLockTime,
      quoteTokenLockTime,
      baseTokenLockAmount,
      quoteTokenLockAmount
    } = this.state
    const {api} = this.context
    console.log(this.props)
    console.log(selectedRelay)
    const tokenSymbol = baseTokenSelected
      ? selectedTokensPair.baseToken.symbol
      : selectedTokensPair.quoteToken.symbol
    let tokenAddress,
      tokenWrapperAddress,
      amount,
      time,
      decimals,
      isOldERC20,
      transactionDetails,
      receipt,
      transactionId,
      errorArray
    if (baseTokenSelected) {
      tokenAddress = selectedTokensPair.baseToken.address
      tokenWrapperAddress =
        selectedTokensPair.baseToken.wrappers[selectedRelay.name].address
      decimals = selectedTokensPair.baseToken.decimals
      amount = baseTokenLockAmount
      time = baseTokenLockTime
      isOldERC20 = selectedTokensPair.baseToken.isOldERC20
    } else {
      tokenAddress = selectedTokensPair.quoteToken.address
      tokenWrapperAddress =
        selectedTokensPair.quoteToken.wrappers[selectedRelay.name].address
      decimals = selectedTokensPair.quoteToken.decimals
      amount = quoteTokenLockAmount
      time = quoteTokenLockTime
      isOldERC20 = selectedTokensPair.quoteToken.isOldERC20
    }
    console.log(action)
    const poolApi = await new PoolApi(window.web3)
    switch (action) {
      case 'lock':
        // Locking
        if (
          !this.isBalanceSufficient(
            toBaseUnitAmount(new BigNumber(amount), decimals),
            baseTokenSelected
              ? selectedFund.liquidity.baseToken.balance
              : selectedFund.liquidity.quoteToken.balance
          )
        ) {
          console.log(amount, selectedFund.liquidity.baseToken.balanceWrapper)
          this.setState({
            errorText: 'You cannot lock more than token balance'
          })
          return
        }
        console.log(time)
        console.log(
          selectedFund.managerAccount,
          selectedFund.details.address,
          selectedExchange.exchangeContractAddress,
          tokenAddress,
          tokenWrapperAddress,
          toBaseUnitAmount(new BigNumber(amount), decimals),
          time,
          isOldERC20
        )
        transactionId = sha3_512(new Date() + selectedFund.managerAccount)
        transactionDetails = {
          status: 'pending',
          hash: '',
          parityId: null,
          timestamp: new Date(),
          account: selectedFund.details.address,
          error: false,
          action: action === 'lock' ? 'LockToken' : 'UnLockToken',
          symbol: tokenSymbol.toUpperCase(),
          amount: amount
        }
        this.props.dispatch(
          Actions.transactions.addTransactionToQueueAction(
            transactionId,
            transactionDetails
          )
        )
        try {
          await poolApi.contract.drago.init(selectedFund.details.address)
          await poolApi.contract.drago.operateOnExchangeEFXLock(
            selectedFund.managerAccount,
            selectedFund.details.address,
            selectedExchange.exchangeContractAddress,
            tokenAddress,
            tokenWrapperAddress,
            toBaseUnitAmount(new BigNumber(amount), decimals),
            time,
            isOldERC20
          )
          this.props.dispatch(
            Actions.exchange.updateLiquidityAndTokenBalances(api, '')
          )
          this.props.dispatch(
            Actions.transactions.addTransactionToQueueAction(
              transactionId,
              transactionDetails
            )
          )
        } catch (error) {
          errorArray = serializeError(error).message.split(/\r?\n/)
          transactionDetails.status = 'error'
          transactionDetails.error = errorArray[0]
          this.props.dispatch(
            Actions.transactions.addTransactionToQueueAction(
              transactionId,
              transactionDetails
            )
          )
          utils.notificationError(
            this.props.notifications.engine,
            serializeError(error).message
          )
        }

        break
      case 'unlock':
        // Unloking
        if (
          !this.isBalanceSufficient(
            toBaseUnitAmount(new BigNumber(amount), decimals),
            baseTokenSelected
              ? selectedFund.liquidity.baseToken.balanceWrapper
              : selectedFund.liquidity.quoteToken.balanceWrapper
          )
        ) {
          console.log(amount, selectedFund.liquidity.baseToken.balanceWrapper)
          this.setState({
            errorText: 'You cannot unlock more than locked amount'
          })
          return
        }
        console.log(
          selectedFund.managerAccount,
          selectedFund.details.address,
          selectedExchange.exchangeContractAddress,
          tokenAddress,
          tokenWrapperAddress,
          toBaseUnitAmount(new BigNumber(amount), decimals)
        )
        transactionId = sha3_512(new Date() + selectedFund.managerAccount)
        transactionDetails = {
          status: 'pending',
          hash: '',
          parityId: null,
          timestamp: new Date(),
          account: selectedFund.details.address,
          error: false,
          action: action === 'lock' ? 'LockToken' : 'UnLockToken',
          symbol: tokenSymbol.toUpperCase(),
          amount: amount
        }
        this.props.dispatch(
          Actions.transactions.addTransactionToQueueAction(
            transactionId,
            transactionDetails
          )
        )
        try {
          await poolApi.contract.drago.init(selectedFund.details.address)
          receipt = await poolApi.contract.drago.operateOnExchangeEFXUnlock(
            selectedFund.managerAccount,
            selectedFund.details.address,
            selectedExchange.exchangeContractAddress,
            tokenAddress,
            tokenWrapperAddress,
            toBaseUnitAmount(new BigNumber(amount), decimals)
          )
          transactionDetails.status = 'executed'
          transactionDetails.receipt = receipt
          transactionDetails.hash = receipt.transactionHash
          transactionDetails.timestamp = new Date()
          // Updating selected tokens pair balances and fund liquidity (ETH, ZRX)
          this.props.dispatch(
            Actions.exchange.updateLiquidityAndTokenBalances(api, '')
          )
          this.props.dispatch(
            Actions.transactions.addTransactionToQueueAction(
              transactionId,
              transactionDetails
            )
          )
        } catch (error) {
          errorArray = serializeError(error).message.split(/\r?\n/)
          transactionDetails.status = 'error'
          transactionDetails.error = errorArray[0]
          this.props.dispatch(
            Actions.transactions.addTransactionToQueueAction(
              transactionId,
              transactionDetails
            )
          )
          utils.notificationError(
            this.props.notifications.engine,
            serializeError(error).message
          )
        }

        break
      default:
        return
    }
  }

  onChangeAmount = (amount, baseToken, errorText) => {
    console.log(amount, baseToken, errorText)
    baseToken === true
      ? this.setState({ baseTokenLockAmount: amount, errorText })
      : this.setState({ quoteTokenLockAmount: amount, errorText })
  }

  onChangeTime = (amount, baseToken, errorText) => {
    console.log(amount, baseToken, errorText)
    baseToken === true
      ? this.setState({ baseTokenLockTime: amount, errorText })
      : this.setState({ quoteTokenLockTime: amount, errorText })
  }

  onCheckToken = token => {
    console.log(token)
    switch (token) {
      case 'baseTokenSelected':
        this.setState({
          baseTokenSelected: true,
          errorText: ''
        })
        break
      case 'quoteTokenSelected':
        this.setState({
          baseTokenSelected: false,
          errorText: ''
        })
        break
    }
  }

  render() {
    const { api } = this.context
    const { selectedFund, selectedTokensPair } = this.props

    const baseTokenWrappedBalance = toUnitAmount(
      selectedFund.liquidity.baseToken.balanceWrapper,
      selectedTokensPair.baseToken.decimals
    ).toFixed(4)
    const quoteTokenWrappedBalance = toUnitAmount(
      selectedFund.liquidity.quoteToken.balanceWrapper,
      selectedTokensPair.quoteToken.decimals
    ).toFixed(4)
    return (
      <div key="lockedTokenInfo">
        <Row>
          <Col xs={12}>
            <SectionTitleExchange titleText="TOKEN LOCK" />
          </Col>

          <Col xs={12}>
            <Row className={styles.lockHeader}>
              <Col xs={1} />
              <Col xs={2} />
              <Col xs={3}>Locked</Col>
              <Col xs={4}>Amount</Col>
              <Col xs={2}>Hr</Col>
            </Row>
            <Row>
              <Col xs={1}>
                <Checkbox
                  checked={this.state.baseTokenSelected}
                  onCheck={() => this.onCheckToken('baseTokenSelected')}
                  id="baseTokenSelected"
                  key="baseTokenSelected"
                  iconStyle={{
                    width: '18px',
                    height: '18px',
                    marginTop: '1px'
                  }}
                />
              </Col>
              <Col xs={2}>
                <span className={styles.symbolText}>
                  <small>{selectedTokensPair.baseToken.symbol}</small>
                </span>
              </Col>
              <Col xs={3}>
                <TokenLockBalance
                  key="baseTokenBalance"
                  balance={baseTokenWrappedBalance}
                  lockTime={selectedTokensPair.baseTokenLockWrapExpire}
                />
              </Col>
              <Col xs={4}>
                <TokenAmountInputField
                  key="baseTokenField"
                  lockMaxAmount={selectedFund.liquidity.baseToken.balance}
                  isBaseToken={true}
                  onChangeAmount={this.onChangeAmount}
                  disabled={false}
                  amount={this.state.baseTokenLockAmount}
                />
              </Col>
              <Col xs={2}>
                <TokenLockTimeField
                  key="baseTokenTimeField"
                  isBaseToken={true}
                  onChangeTime={this.onChangeTime}
                  disabled={false}
                  amount={this.state.baseTokenLockTime}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={1}>
                <Checkbox
                  checked={!this.state.baseTokenSelected}
                  onCheck={() => this.onCheckToken('quoteTokenSelected')}
                  id="quoteTokenSelected"
                  key="quoteTokenSelected"
                  iconStyle={{
                    width: '18px',
                    height: '18px',
                    marginTop: '1px'
                  }}
                />
              </Col>
              <Col xs={2}>
                <span className={styles.symbolText}>
                  <small>{selectedTokensPair.quoteToken.symbol}</small>
                </span>
              </Col>
              <Col xs={3}>
                <TokenLockBalance
                  key="quoteTokenBalance"
                  balance={quoteTokenWrappedBalance}
                  lockTime={selectedTokensPair.quoteTokenLockWrapExpire}
                />
              </Col>
              <Col xs={4}>
                <TokenAmountInputField
                  key="quoteTokenField"
                  lockMaxAmount={selectedFund.liquidity.baseToken.balance}
                  isBaseToken={false}
                  onChangeAmount={this.onChangeAmount}
                  disabled={false}
                  amount={this.state.quoteTokenLockAmount}
                />
              </Col>
              <Col xs={2}>
                <TokenLockTimeField
                  key="quoteTokenTimeField"
                  isBaseToken={true}
                  onChangeTime={this.onChangeTime}
                  disabled={false}
                  amount={this.state.quoteTokenLockTime}
                />
              </Col>
            </Row>
            <div className={styles.buttonsLock}>
              <Row>
                <Col xs={6}>
                  <ButtonLock
                    buttonAction={'unlock'}
                    onLockTocken={this.onLockTocken}
                    disabled={this.state.errorText !== ''}
                  />
                </Col>
                <Col xs={6}>
                  <ButtonLock
                    buttonAction={'lock'}
                    onLockTocken={this.onLockTocken}
                    disabled={
                      // this.state.errorText !== '' ||
                      (new BigNumber(
                        selectedFund.liquidity.baseToken.balance
                      ).eq(0) &&
                        this.state.baseTokenSelected) ||
                      (new BigNumber(
                        selectedFund.liquidity.quoteToken.balance
                      ).eq(0) &&
                        !this.state.baseTokenSelected)
                    }
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={12}>
            <LockErrorMessage message={this.state.errorText} />
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect()(TokenLockInfo)
