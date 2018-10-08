import { Col, Row } from 'react-flexbox-grid'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
// import * as Colors from 'material-ui/styles/colors'
import BoxTitle from '../atoms/boxTitle'
import ButtonBuy from '../atoms/buttonBuy'
import ButtonOrderCancel from '../atoms/buttonOrderCancel'
import ButtonOrderSubmit from '../atoms/buttonOrderSubmit'
import ButtonSell from '../atoms/buttonSell'
import OrderAmountInputField from '../atoms/orderAmountInputField'
import OrderPrice from '../atoms/orderPrice'
import OrderRawDialog from '../molecules/orderRawDialog'
import OrderSummary from '../molecules/orderSummary'
import Paper from 'material-ui/Paper'
import styles from './orderBox.module.css'
// import OrderTypeSelector from '../atoms/orderTypeSelector'
import { Actions } from '../../_redux/actions'
import {
  CANCEL_SELECTED_ORDER,
  UPDATE_FUND_LIQUIDITY,
  UPDATE_SELECTED_ORDER,
  UPDATE_TRADE_TOKENS_PAIR
} from '../../_redux/actions/const'
import { UNLIMITED_ALLOWANCE_IN_BASE_UNITS } from '../../_utils/const'
import { connect } from 'react-redux'
import {
  fillOrderToExchangeViaProxy,
  newMakerOrder,
  setAllowaceOnExchangeThroughDrago,
  signOrder,
  submitOrderToRelay,
  submitOrderToRelayEFX
} from '../../_utils/exchange'
import { sha3_512 } from 'js-sha3'
import ToggleSwitch from '../atoms/toggleSwitch'
import serializeError from 'serialize-error'
import utils from '../../_utils/utils'

function mapStateToProps(state) {
  return state
}

const paperStyle = {
  padding: '10px'
}

class OrderBox extends Component {
  static propTypes = {
    exchange: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    notifications: PropTypes.object.isRequired
  }

  state = {
    orderRawDialogOpen: false
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  updateSelectedTradeTokensPair = (token, allowance) => {
    switch (token) {
      case 'base':
        return {
          type: UPDATE_TRADE_TOKENS_PAIR,
          payload: {
            baseTokenAllowance: allowance
          }
        }
      case 'quote':
        return {
          type: UPDATE_TRADE_TOKENS_PAIR,
          payload: {
            quoteTokenAllowance: allowance
          }
        }
    }
  }

  updateSelectedFundLiquidity = (fundAddress, api) => {
    return {
      type: UPDATE_FUND_LIQUIDITY,
      payload: {
        fundAddress,
        api
      }
    }
  }

  onCloseOrderRawDialog = open => {
    this.setState({
      orderRawDialogOpen: open
    })
  }

  updateSelectedOrder = payload => {
    return {
      type: UPDATE_SELECTED_ORDER,
      payload: payload
    }
  }

  cancelSelectedOrder = () => {
    return {
      type: CANCEL_SELECTED_ORDER
    }
  }

  onChangeAmount = (amount, error) => {
    const payload = {
      orderAmountError: error,
      orderFillAmount: amount
    }
    console.log(amount)
    this.props.dispatch(this.updateSelectedOrder(payload))
  }

  onChangePrice = (amount, error) => {
    const payload = {
      orderPriceError: error,
      orderPrice: amount
    }
    console.log(amount)
    this.props.dispatch(this.updateSelectedOrder(payload))
  }

  // onSendOrder = async () => {
  //   const { selectedOrder } = this.props.exchange
  //   submitOrderToRelay(selectedOrder.details.order.signedOrder)
  //     .then(parsedBody => {
  //       // transactionDetails.status = 'executed'
  //       // transactionDetails.timestamp = new Date()
  //       // this.props.dispatch(
  //       //   Actions.transactions.addTransactionToQueueAction(
  //       //     transactionId,
  //       //     transactionDetails
  //       //   )
  //       // )
  //       console.log(parsedBody)
  //     })
  //     .catch(error => {
  //       // const errorArray = serializeError(error).message.split(/\r?\n/)
  //       // transactionDetails.status = 'error'
  //       // transactionDetails.error = errorArray[0]
  //       // this.props.dispatch(
  //       //   Actions.transactions.addTransactionToQueueAction(
  //       //     transactionId,
  //       //     transactionDetails
  //       //   )
  //       // )
  //       console.log(error)
  //       utils.notificationError(
  //         this.props.notifications.engine,
  //         serializeError(error).message
  //       )
  //     })
  // }

  onSubmitOrder = async () => {
    const {
      selectedOrder,
      selectedExchange,
      selectedFund,
      walletAddress
    } = this.props.exchange

    const transactionId = sha3_512(new Date() + selectedFund.managerAccount)
    let transactionDetails = {
      status: 'pending',
      hash: '',
      parityId: null,
      timestamp: new Date(),
      account: selectedFund.details.address,
      error: false,
      action: selectedOrder.orderType === 'asks' ? 'BuyToken' : 'SellToken',
      symbol: selectedOrder.selectedTokensPair.baseToken.symbol.toUpperCase(),
      amount: selectedOrder.orderFillAmount
    }
    this.props.dispatch(
      Actions.transactions.addTransactionToQueueAction(
        transactionId,
        transactionDetails
      )
    )

    if (selectedOrder.takerOrder) {
      // fillOrderToExchange(selectedOrder.details.order, selectedOrder.orderFillAmount, selectedExchange)
      try {
        const receipt = await fillOrderToExchangeViaProxy(
          selectedFund,
          selectedOrder.details.order,
          selectedOrder.orderFillAmount,
          selectedExchange
        )
        console.log(receipt)
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

        // Updating drago liquidity
        this.props.dispatch(
          this.updateSelectedFundLiquidity(
            selectedFund.details.address,
            this.context.api
          )
        )
      } catch (error) {
        console.log(serializeError(error))
        const errorArray = serializeError(error).message.split(/\r?\n/)
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
    } else {
      console.log(selectedOrder)
      const transactionId = sha3_512(new Date() + selectedFund.managerAccount)
      transactionDetails = {
        status: 'pending',
        hash: '',
        parityId: null,
        timestamp: new Date(),
        account: selectedFund.details.address,
        error: false,
        action: selectedOrder.orderType === 'asks' ? 'BuyToken' : 'SellToken',
        symbol: selectedOrder.selectedTokensPair.baseToken.symbol.toUpperCase(),
        amount: selectedOrder.orderFillAmount
      }
      let signedOrder = await signOrder(
        selectedOrder,
        selectedExchange,
        walletAddress
      )
      console.log(signedOrder)
      const payload = {
        details: { order: signedOrder }
      }
      this.props.dispatch(this.updateSelectedOrder(payload))
      this.setState({
        orderRawDialogOpen: true
      })
      const efxOrder = {
        type: 'EXCHANGE LIMIT',
        symbol: 'tETHUSD',
        amount:
          selectedOrder.orderType === 'asks'
            ? selectedOrder.orderFillAmount
            : -Math.abs(selectedOrder.orderFillAmount),
        price: selectedOrder.orderPrice,
        meta: signedOrder,
        protocol: '0x'
      }
      console.log(selectedOrder)
      submitOrderToRelayEFX(efxOrder)
        .then(parsedBody => {
          transactionDetails.status = 'executed'
          transactionDetails.timestamp = new Date()
          this.props.dispatch(
            Actions.transactions.addTransactionToQueueAction(
              transactionId,
              transactionDetails
            )
          )
          console.log(parsedBody)
        })
        .catch(error => {
          const errorArray = serializeError(error).message.split(/\r?\n/)
          transactionDetails.status = 'error'
          transactionDetails.error = errorArray[0]
          this.props.dispatch(
            Actions.transactions.addTransactionToQueueAction(
              transactionId,
              transactionDetails
            )
          )
          console.log(error)
          utils.notificationError(
            this.props.notifications.engine,
            serializeError(error).message
          )
        })
    }
  }

  onCancelOrder = () => {
    this.props.dispatch(this.cancelSelectedOrder())
  }

  onSelectOrderType = () => {}

  onToggleAllowQuoteTokenTrade = async (event, isInputChecked) => {
    const {
      selectedFund,
      selectedTokensPair,
      selectedExchange
    } = this.props.exchange
    let amount
    isInputChecked
      ? (amount = UNLIMITED_ALLOWANCE_IN_BASE_UNITS)
      : (amount = '0')
    try {
      const result = await setAllowaceOnExchangeThroughDrago(
        selectedFund,
        selectedTokensPair.quoteToken,
        selectedExchange,
        amount
      )
      console.log(result)
      this.props.dispatch(
        this.updateSelectedTradeTokensPair('quote', isInputChecked)
      )
    } catch (error) {
      console.log(error)
      utils.notificationError(
        this.props.notifications.engine,
        serializeError(error).message
      )
    }
  }

  onToggleAllowanceBaseTokenTrade = async (event, isInputChecked) => {
    // const { selectedFund, selectedTokensPair } = this.props.exchange
    // try {
    //   // var provider = account.source === 'MetaMask' ? window.web3 : api
    //   var poolApi = null;
    //   poolApi = new PoolApi(window.web3)
    //   poolApi.contract.drago.init(selectedFund.details.address)
    //   const result = await poolApi.contract.drago.setInfiniteAllowace(
    //     selectedFund.managerAccount,
    //     this.props.exchange.selectedExchange.tokenTransferProxyAddress,
    //     selectedTokensPair.baseToken.address,
    //   )
    //   console.log(result)
    //   this.props.dispatch(this.updateSelectedTradeTokensPair('base', true))
    // } catch (error) {
    //   console.log(error)
    // }

    const {
      selectedFund,
      selectedTokensPair,
      selectedExchange
    } = this.props.exchange
    let amount
    isInputChecked
      ? (amount = UNLIMITED_ALLOWANCE_IN_BASE_UNITS)
      : (amount = '0')
    try {
      const result = await setAllowaceOnExchangeThroughDrago(
        selectedFund,
        selectedTokensPair.baseToken,
        selectedExchange,
        amount
      )
      console.log(result)
      this.props.dispatch(
        this.updateSelectedTradeTokensPair('base', isInputChecked)
      )
    } catch (error) {
      console.log(error)
    }
  }

  onBuySell = async orderType => {
    const {
      selectedTokensPair,
      selectedExchange,
      selectedFund,
      selectedRelay
    } = this.props.exchange
    const order = await newMakerOrder(
      orderType,
      selectedTokensPair,
      selectedExchange,
      selectedFund,
      selectedRelay.isTokenWrapper
    )
    const makerOrder = {
      details: {
        order: order,
        orderAmount: 0,
        orderPrice: 0,
        orderType: orderType
      },
      orderAmountError: true,
      orderPriceError: true,
      orderFillAmount: '0',
      orderMaxAmount: '0',
      orderPrice: '0',
      orderType: orderType,
      takerOrder: false,
      selectedTokensPair: selectedTokensPair
    }
    console.log(makerOrder)
    this.props.dispatch(this.updateSelectedOrder(makerOrder))
    // this.setState({
    //   orderRawDialogOpen: true
    // })
  }

  render() {
    const { selectedOrder, selectedTokensPair } = this.props.exchange
    let buySelected = selectedOrder.orderType === 'bids'
    let sellSelected = selectedOrder.orderType === 'asks'
    if (selectedOrder.takerOrder) {
      buySelected = selectedOrder.orderType === 'asks'
      sellSelected = selectedOrder.orderType === 'bids'
    }

    return (
      <Row>
        <Col xs={12}>
          <Row className={styles.sectionTitle}>
            <Col xs={12}>
              <BoxTitle titleText={'ORDER BOX'} />
              <Paper style={paperStyle} zDepth={1}>
                <Row className={styles.orderBookContainer}>
                  <Col xs={12}>
                    <Row className={styles.sectionHeaderOrderTable}>
                      <Col xs={6} className={styles.buyButton}>
                        <ButtonBuy
                          selected={buySelected}
                          onBuySell={this.onBuySell}
                        />
                      </Col>
                      <Col xs={6} className={styles.sellButton}>
                        <ButtonSell
                          selected={sellSelected}
                          onBuySell={this.onBuySell}
                        />
                      </Col>
                    </Row>
                  </Col>

                  {/* <Col xs={12} className={styles.tokenNameSymbol}>
                    <div className={styles.tokenSymbol}>
                      {selectedTokensPair.baseToken.symbol}
                    </div>
                    <div className={styles.tokenName}>
                      {selectedTokensPair.baseToken.name}
                    </div>
                    <div>
                      <ToggleSwitch
                        label={
                          'ACTIVATE ' + selectedTokensPair.baseToken.symbol
                        }
                        onToggle={this.onToggleAllowanceBaseTokenTrade}
                        toggled={selectedTokensPair.baseTokenAllowance}
                        toolTip={
                          'Activate ' +
                          selectedTokensPair.baseToken.symbol +
                          ' trading'
                        }
                      />
                      <ToggleSwitch
                        label={
                          'ACTIVATE ' + selectedTokensPair.quoteToken.symbol
                        }
                        onToggle={this.onToggleAllowQuoteTokenTrade}
                        toggled={selectedTokensPair.quoteTokenAllowance}
                        toolTip={
                          'Activate ' +
                          selectedTokensPair.quoteToken.symbol +
                          ' trading'
                        }
                      />
                    </div>
                  </Col> */}

                  {/* <Col xs={12}>
                    <OrderTypeSelector
                      orderTypes={['Market', 'Limit']}
                      onSelectOrderType={this.onSelectOrderType}
                    />

                  </Col> */}

                  <Col xs={12}>
                    <OrderAmountInputField
                      orderMaxAmount={Number(selectedOrder.orderMaxAmount)}
                      orderFillAmount={selectedOrder.orderFillAmount}
                      symbol={selectedOrder.selectedTokensPair.baseToken.symbol}
                      onChangeAmount={this.onChangeAmount}
                      disabled={Object.keys(selectedOrder.details).length === 0}
                      checkMaxAmount={selectedOrder.takerOrder}
                    />
                  </Col>
                  <Col xs={12}>
                    <OrderPrice
                      orderPrice={selectedOrder.orderPrice}
                      onChangePrice={this.onChangePrice}
                      disabled={
                        selectedOrder.takerOrder ||
                        Object.keys(selectedOrder.details).length === 0
                      }
                    />
                  </Col>
                  <Col xs={12}>
                    <Row center="xs">
                      <Col xs={6}>
                        <ButtonOrderCancel
                          onCancelOrder={this.onCancelOrder}
                          disabled={
                            Object.keys(selectedOrder.details).length === 0
                          }
                        />
                      </Col>
                      <Col xs={6}>
                        <ButtonOrderSubmit
                          onSubmitOrder={this.onSubmitOrder}
                          disabled={
                            selectedOrder.orderAmountError ||
                            selectedOrder.orderPriceError
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    {Object.keys(selectedOrder.details).length !== 0 ? (
                      <OrderSummary order={selectedOrder} />
                    ) : null}
                  </Col>
                </Row>
              </Paper>
            </Col>
          </Row>
        </Col>
        <OrderRawDialog
          order={selectedOrder.details.order}
          onClose={this.onCloseOrderRawDialog}
          open={this.state.orderRawDialogOpen}
        />
      </Row>
    )
  }
}

export default connect(mapStateToProps)(OrderBox)
