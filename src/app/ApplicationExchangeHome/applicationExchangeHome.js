// Copyright 2016-2017 Rigo Investment Sagl.

import { Col, Row } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import BigNumber from 'bignumber.js'
import ElementBottomStatusBar from '../Elements/elementBottomStatusBar'
import ElementNotificationsDrawer from '../Elements/elementNotificationsDrawer'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
// import FlatButton from 'material-ui/FlatButton'
import Loading from '../_atomic/atoms/loading'
import PoolApi from '../PoolsApi/src'
// import DragoComingSoon from '../Elements/elementDragoComingSoon'
import { Actions } from '../_redux/actions'
import {
  DEFAULT_RELAY,
  ERC20_TOKENS,
  EXCHANGES,
  RELAYS,
  TRADE_TOKENS_PAIRS
} from '../_utils/const'
import ChartBox from '../_atomic/organisms/chartBox'
import FundSelector from '../_atomic/molecules/fundSelector'
import OrderBook from '../_atomic/organisms/orderBook'
import OrderBox from '../_atomic/organisms/orderBox'
import OrdersHistoryBox from '../_atomic/organisms/ordersHistoryBox'
import TokenBalances from '../_atomic/atoms/tokenBalances'
import TokenLiquidity from '../_atomic/atoms/tokenLiquidity'
import TokenPrice from '../_atomic/atoms/tokenPrice'
import TokenTradeSelector from '../_atomic/molecules/tokenTradeSelector'
import exchangeConnector, {
  NETWORKS,
  exchanges,
  supportedExchanges
} from '@rigoblock/exchange-connector'

import {
  CANCEL_SELECTED_ORDER,
  FETCH_ACCOUNT_ORDERS,
  RELAY_CLOSE_WEBSOCKET,
  UPDATE_FUND_LIQUIDITY,
  UPDATE_SELECTED_FUND
} from '../_redux/actions/const'
import { getAvailableAccounts, getTokenAllowance } from '../_utils/exchange'
import ExchangeBox from '../_atomic/organisms/exchangeBox'
import styles from './applicationExchangeHome.module.css'
import utils from '../_utils/utils'

// import { getData } from "../_utils/data"

function mapStateToProps(state) {
  return state
}

class ApplicationExchangeHome extends Component {
  constructor() {
    super()
    this._notificationSystem = null
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    endpoint: PropTypes.object.isRequired,
    transactionsDrago: PropTypes.object.isRequired,
    handleToggleNotifications: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    notificationsOpen: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    exchange: PropTypes.object.isRequired
  }

  state = {
    chartData: [],
    managerHasNoFunds: false
  }

  scrollPosition = 0
  activeElement = null

  updateSelectedFundDetails = (fund, managerAccount) => {
    const payload = {
      details: fund,
      // liquidity: {
      //   ETH: liquidity[0],
      //   WETH: liquidity[1],
      //   ZRX: liquidity[2]
      // },
      managerAccount
    }
    return {
      type: UPDATE_SELECTED_FUND,
      payload: payload
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

  getFundOrders = (networkId, maker, baseTokenAddress, quoteTokenAddress) => {
    const payload = {
      networkId,
      maker,
      baseTokenAddress,
      quoteTokenAddress
    }
    console.log(payload)
    return {
      type: FETCH_ACCOUNT_ORDERS,
      payload: payload
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let stateUpdate = true
    let propsUpdate = true
    // shouldComponentUpdate returns false if no need to update children, true if needed.
    propsUpdate = !utils.shallowEqual(this.props, nextProps)
    stateUpdate = !utils.shallowEqual(this.state.loading, nextState.loading)
    stateUpdate = !utils.shallowEqual(this.state, nextState)
    // Saving the scroll position. Neede in componentDidUpdate in order to avoid the the page scroll to be
    // set top
    const element = this.node
    if (element !== null) {
      this.scrollPosition = window.scrollY
    }
    return stateUpdate || propsUpdate
  }

  componentDidMount = async () => {
    const { api } = this.context
    const { selectedExchange } = this.props.exchange
    const { endpoint } = this.props

    const defaultRelay = RELAYS[DEFAULT_RELAY[api._rb.network.name]]
    const defaultExchange = EXCHANGES[defaultRelay.name][api._rb.network.name]
    const defaultTokensPair = {
      baseToken:
        ERC20_TOKENS[api._rb.network.name][
          defaultRelay.defaultTokensPair.baseTokenSymbol
        ],
      quoteToken:
        ERC20_TOKENS[api._rb.network.name][
          defaultRelay.defaultTokensPair.quoteTokenSymbol
        ]
    }
    console.log('***** MOUNT *****')
    try {
      // const address = await getAvailableAccounts(selectedExchange)
      // this.props.dispatch({
      //   type: 'SET_MAKER_ADDRESS',
      //   payload: address[0]
      // })
      // const accounts = [
      //   {
      //     address: address[0]
      //   }
      // ]
      const walletAddress = endpoint.accounts.find(
        account => account.source === 'MetaMask'
      )
      this.props.dispatch({
        type: 'SET_MAKER_ADDRESS',
        payload: walletAddress.address
      })
      const accounts = [
        {
          address: walletAddress.address
        }
      ]
      console.log(walletAddress.address)

      // Get funds details (balance, transactions)
      this.getSelectedFundDetails(null, accounts)

      // Set available relays
      this.props.dispatch(
        Actions.exchange.updateAvailableRelays(
          utils.availableRelays(RELAYS, api._rb.network.id)
        )
      )
      console.log(defaultExchange)
      // Updating selected exchange
      this.props.dispatch(
        Actions.exchange.updateSelectedExchange(defaultExchange)
      )

      // Updating selected relay
      this.props.dispatch(Actions.exchange.updateSelectedRelay(defaultRelay))

      // Set available trade tokens pairs
      this.props.dispatch(
        Actions.exchange.updateAvailableTradeTokensPairs(
          utils.availableTradeTokensPair(TRADE_TOKENS_PAIRS, defaultRelay.name)
        )
      )

      // Updating selected tokens pair
      this.props.dispatch(
        Actions.exchange.updateSelectedTradeTokensPair(defaultTokensPair)
      )

      // Updating selected tokens pair balances and fund liquidity (ETH, ZRX)
      this.props.dispatch(
        Actions.exchange.updateLiquidityAndTokenBalances(api, 'START')
      )

      this.connectToExchange(defaultRelay, defaultTokensPair)

      // Getting trade history logs
      // this.props.dispatch(
      //   Actions.exchange.getTradeHistoryLogs(
      //     defaultRelay,
      //     api._rb.network.id,
      //     defaultTokensPair.baseToken.address,
      //     defaultTokensPair.quoteToken.address
      //   )
      // )

      // // Getting history logs
      // this.props.dispatch(this.getTradeHistoryLogs(
      //   this.props.exchange.relay.networkId,
      //   this.props.exchange.selectedTokensPair.baseToken.address,
      //   this.props.exchange.selectedTokensPair.quoteToken.address,
      // )
      // )

      // Getting chart data
      let tsYesterday = new Date(
        (Math.floor(Date.now() / 1000) - 86400 * 7) * 1000
      ).toISOString()
      this.props.dispatch(
        Actions.exchange.fetchCandleDataSingle(
          defaultRelay,
          api._rb.network.id,
          defaultTokensPair.baseToken,
          defaultTokensPair.quoteToken,
          tsYesterday
        )
      )
    } catch (error) {
      console.warn(error)
    }
  }

  componentWillUnmount = () => {
    console.log('***** UNMOUNT *****')
    const { api } = this.context
    this.props.dispatch(Actions.exchange.relayCloseWs())
    this.props.dispatch(
      Actions.exchange.updateLiquidityAndTokenBalances(api, 'STOP')
    )
  }

  UNSAFE_componentWillUpdate() {
    // Storing the active document, so we can preserve focus in forms.
    this.activeElement = document.activeElement
  }

  componentDidUpdate() {
    const element = this.node
    if (element !== null) {
      window.scrollTo(0, this.scrollPosition)
    }
    // Setting focus on the element active before component re-render
    if (this.activeElement.id !== '') {
      const activeElement = document.getElementById(this.activeElement.id)
      if (activeElement !== null) {
        activeElement.focus()
      }
    }
  }

  connectToExchange = async (defaultRelay, defaultTokensPair) => {
    const { api } = this.context
    this.props.dispatch(
      Actions.exchange.relayGetOrders(
        defaultRelay,
        api._rb.network.id,
        defaultTokensPair.baseToken,
        defaultTokensPair.quoteToken,
        defaultRelay.initOrdeBookAggregated
      )
    )
    this.props.dispatch(
      Actions.exchange.relayOpenWs(
        defaultRelay,
        api._rb.network.id,
        defaultTokensPair.baseToken,
        defaultTokensPair.quoteToken
      )
    )
  }

  onToggleAggregateOrders = isInputChecked => {
    console.log(isInputChecked)
    this.props.dispatch(Actions.exchange.setAggregateOrders(isInputChecked))

    let filter = {
      relay: this.props.exchange.selectedRelay,
      networkId: this.props.exchange.relay.networkId,
      baseToken: this.props.exchange.selectedTokensPair.baseToken,
      quoteToken: this.props.exchange.selectedTokensPair.quoteToken,
      aggregated: isInputChecked
    }
    this.props.dispatch(Actions.exchange.relayGetOrders(filter))
  }

  onSelectFund = async fund => {
    const { api } = this.context
    const {
      selectedTokensPair,
      selectedExchange,
      selectedRelay
    } = this.props.exchange

    // Resetting current order
    this.props.dispatch({
      type: CANCEL_SELECTED_ORDER
    })

    try {
      const poolApi = new PoolApi(api)
      poolApi.contract.drago.init(fund.address)

      // Getting drago details
      const dragoDetails = await poolApi.contract.drago.getAdminData()
      this.props.dispatch(
        this.updateSelectedFundDetails(fund, dragoDetails[0].toLowerCase())
      )

      // Getting drago liquidity
      // this.props.dispatch(this.updateSelectedFundLiquidity(fund.address, api))

      // Updating selected tokens pair balances and fund liquidity (ETH, ZRX)
      this.props.dispatch(
        Actions.exchange.updateLiquidityAndTokenBalances(api, '', fund.address)
      )

      // Getting allowances
      const allowanceBaseToken = await getTokenAllowance(
        selectedTokensPair.baseToken,
        fund.address,
        selectedExchange
      )
      const allowanceQuoteToken = await getTokenAllowance(
        selectedTokensPair.quoteToken,
        fund.address,
        selectedExchange
      )

      // Getting token wrapper lock time
      const baseTokenLockWrapExpire = await utils.updateTokenWrapperLockTime(
        api,
        selectedTokensPair.baseToken.wrappers[selectedRelay.name].address,
        fund.address
      )
      const quoteTokenLockWrapExpire = await utils.updateTokenWrapperLockTime(
        api,
        selectedTokensPair.quoteToken.wrappers[selectedRelay.name].address,
        fund.address
      )

      const payload = {
        baseTokenAllowance: new BigNumber(allowanceBaseToken).gt(0),
        quoteTokenAllowance: new BigNumber(allowanceQuoteToken).gt(0),
        baseTokenLockWrapExpire: baseTokenLockWrapExpire,
        quoteTokenLockWrapExpire: quoteTokenLockWrapExpire
      }

      console.log(payload)

      this.props.dispatch(
        Actions.exchange.updateSelectedTradeTokensPair(payload)
      )
      // Getting fund orders
      // this.props.dispatch(this.getFundOrders(
      //   this.props.exchange.relay.networkId,
      //   fund.address.toLowerCase(),
      //   this.props.exchange.selectedTokensPair.baseToken.address,
      //   this.props.exchange.selectedTokensPair.quoteToken.address,
      // )
      // )
    } catch (error) {
      console.log(error)
    }
  }

  onSelectTokenTrade = async pair => {
    const { api } = this.context
    const {
      selectedTokensPair,
      selectedExchange,
      selectedFund
    } = this.props.exchange
    const selectedTokens = pair.split('-')
    try {
      const baseToken = ERC20_TOKENS[api._rb.network.name][selectedTokens[0]]
      const quoteToken = ERC20_TOKENS[api._rb.network.name][selectedTokens[1]]
      const allowanceBaseToken = await getTokenAllowance(
        selectedTokensPair.baseToken,
        selectedFund.details.address,
        selectedExchange
      )
      const allowanceQuoteToken = await getTokenAllowance(
        selectedTokensPair.quoteToken,
        selectedFund.details.address,
        selectedExchange
      )
      const tradeTokensPair = {
        baseToken: baseToken,
        quoteToken: quoteToken,
        baseTokenAllowance: new BigNumber(allowanceBaseToken).gt(0),
        quoteTokenAllowance: new BigNumber(allowanceQuoteToken).gt(0),
        ticker: {
          current: {
            price: '0'
          },
          previous: {
            price: '0'
          },
          variation: 0
        }
      }

      // Resetting current order
      this.props.dispatch({
        type: CANCEL_SELECTED_ORDER
      })

      // Updating selected tokens pair
      this.props.dispatch(
        Actions.exchange.updateSelectedTradeTokensPair(tradeTokensPair)
      )

      // Terminating connection to the exchange
      this.props.dispatch({
        type: RELAY_CLOSE_WEBSOCKET
      })

      // Reconnecting to the exchange
      this.connectToExchange(tradeTokensPair)

      // Getting chart data
      // let tsYesterday = new Date(
      //   (Math.floor(Date.now() / 1000) - 86400 * 7) * 1000
      // ).toISOString()
      // this.props.dispatch(
      //   Actions.exchange.fetchCandleDataSingle(
      //     this.props.exchange.selectedRelay,
      //     this.props.exchange.relay.networkId,
      //     this.props.exchange.selectedTokensPair.baseToken,
      //     this.props.exchange.selectedTokensPair.quoteToken,
      //     tsYesterday
      //   )
      // )
    } catch (error) {
      console.log(error)
    }
  }

  // onButtonTest = () => {
  //   console.log('open')
  //   var filter = {
  //     networkId: this.props.exchange.relay.networkId,
  //     baseTokenAddress: this.props.exchange.selectedTokensPair.baseToken.address,
  //     quoteTokenAddress: this.props.exchange.selectedTokensPair.quoteToken.address,
  //     aggregated: this.props.exchange.orderBook.aggregated
  //   }
  //   this.props.dispatch(this.relayGetOrders(filter))
  //   // this.props.dispatch({ type: 'RELAY_SUBSCRIBE_WEBSOCKET', payload: { sub: 'sub:ticker2' }})
  // }

  // onButtonTest2 = () => {
  //   console.log('subscribe')
  //   getMarketTakerOrder(
  //     this.props.exchange.selectedTokensPair.baseToken.address,
  //     this.props.exchange.selectedTokensPair.quoteToken.address,
  //     this.props.exchange.selectedTokensPair.baseToken.address,
  //     '95000000000000000000',
  //     this.props.exchange.relay.networkId,
  //     "0x57072759Ba54479669CAdF1A25528a472Af95cEF".toLowerCase()
  //   )
  //     .then(results => {
  //       console.log(results)
  //     })
  // }

  render() {
    const {
      user,
      location,
      handleToggleNotifications,
      notificationsOpen,
      endpoint,
      exchange
    } = this.props
    if (endpoint.loading) {
      return <Loading />
    }
    // console.log(this.props)

    // if (endpoint.networkInfo.name !== 'kovan') {
    //   return (
    //     <div ref={node => this.node = node}>
    //       <Row className={styles.maincontainer}>
    //         <Col xs={12}>
    //           <Paper className={styles.paperTopBarContainer} zDepth={1}>
    //             <div style={{ paddingTop: '16px', paddingBottom: '16px' }}>
    //               The exchange is only available on Ethereum Kovan network.
    //           </div>
    //           </Paper>
    //         </Col>
    //       </Row>
    //       <Row>
    //         <Col xs={12}>
    //           {notificationsOpen ? (
    //             <ElementNotificationsDrawer
    //               handleToggleNotifications={handleToggleNotifications}
    //               notificationsOpen={notificationsOpen}
    //             />
    //           ) : (
    //               null
    //             )}
    //         </Col>
    //       </Row>
    //       <ElementBottomStatusBar
    //         blockNumber={endpoint.prevBlockNumber}
    //         networkName={endpoint.networkInfo.name}
    //         networkError={endpoint.networkError}
    //         networkStatus={endpoint.networkStatus} />
    //     </div>
    //   )
    // }

    if (endpoint.accounts.length === 0 || !endpoint.isMetaMaskNetworkCorrect) {
      return (
        <span>
          <ElementBottomStatusBar
            blockNumber={endpoint.prevBlockNumber}
            networkName={endpoint.networkInfo.name}
            networkError={endpoint.networkError}
            networkStatus={endpoint.networkStatus}
          />
        </span>
      )
    }

    if (this.state.managerHasNoFunds) {
      return (
        <div ref={node => (this.node = node)}>
          <Row className={styles.maincontainer}>
            <Col xs={12}>
              <Paper className={styles.paperTopBarContainer} zDepth={1}>
                <div style={{ paddingTop: '16px', paddingBottom: '16px' }}>
                  You need to own a fund in order to trade on this exchange.
                </div>
              </Paper>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {notificationsOpen ? (
                <ElementNotificationsDrawer
                  handleToggleNotifications={handleToggleNotifications}
                  notificationsOpen={notificationsOpen}
                />
              ) : null}
            </Col>
          </Row>
          <ElementBottomStatusBar
            blockNumber={endpoint.prevBlockNumber}
            networkName={endpoint.networkInfo.name}
            networkError={endpoint.networkError}
            networkStatus={endpoint.networkStatus}
          />
        </div>
      )
    }

    if (user.isManager) {
      const { bids, asks, spread } = this.props.exchange.orderBook
      // console.log(asks)
      // console.log(bids)
      const asksOrderNormalized = asks.slice(0, 20)
      const bidsOrderNormalized = bids.slice(0, 20)
      // console.log(this.props.exchange.selectedExchange)
      // const bidsOrderNormalizedFilled = [ ...Array(20 - bidsOrderNormalized.length).fill(null), ...bidsOrderNormalized ]
      // const asksOrderNormalizedFilled = [ ...Array(20 - asksOrderNormalized.length).fill(null), ...asksOrderNormalized]
      const { chartData, fundOrders } = this.props.exchange
      const currentPrice = new BigNumber(
        this.props.exchange.selectedTokensPair.ticker.current.price
      )
      const priceVariation = new BigNumber(
        this.props.exchange.selectedTokensPair.ticker.variation
      ).toFixed(4)
      // console.log(this.props.exchange)
      // console.log(RELAYS)
      return (
        <div ref={node => (this.node = node)}>
          <Row className={styles.maincontainer}>
            <Col xs={12}>
              <Paper className={styles.paperTopBarContainer} zDepth={1}>
                <Row>
                  <Col xs={4}>
                    <FundSelector
                      funds={this.props.transactionsDrago.manager.list}
                      onSelectFund={this.onSelectFund}
                    />
                  </Col>
                  {/* <Col xs={2}>
                    <TokenLiquidity
                      liquidity={exchange.selectedFund.liquidity}
                      loading={exchange.loading.liquidity}
                    />
                  </Col> */}
                  <Col xs={4}>
                    <TokenTradeSelector
                      tradableTokens={exchange.availableTradeTokensPairs}
                      selectedTradeTokensPair={exchange.selectedTokensPair}
                      onSelectTokenTrade={this.onSelectTokenTrade}
                    />
                  </Col>
                  <Col xs={4} className={styles.tokenPriceContainer}>
                    <TokenPrice
                      selectedTradeTokensPair={exchange.selectedTokensPair}
                      tokenPrice={currentPrice.toFixed(4)}
                      priceVariation={priceVariation}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <TokenBalances
                      liquidity={exchange.selectedFund.liquidity}
                      selectedTradeTokensPair={exchange.selectedTokensPair}
                      // loading={exchange.loading.liquidity}
                    />
                  </Col>
                </Row>
              </Paper>
            </Col>
            {/* <Col xs={12}>
              <ChartBox data={this.state.chartData} />
            </Col> */}
            <Col xs={12}>
              <Row>
                <Col xs={3}>
                  <Row>
                    <Col xs={12}>
                      <div className={styles.boxContainer}>
                        <ExchangeBox />
                      </div>
                    </Col>
                    <Col xs={12}>
                      <div className={styles.boxContainer}>
                        <OrderBox />
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col xs={7}>
                  <Row>
                    <Col xs={12}>
                      <div className={styles.boxContainer}>
                        <ChartBox
                          data={chartData}
                          // loading={exchange.loading.marketBox}
                          loading={false}
                        />
                      </div>
                    </Col>
                    <Col xs={12}>
                      <OrdersHistoryBox fundOrders={fundOrders} />
                    </Col>
                  </Row>
                </Col>
                <Col xs={2}>
                  <OrderBook
                    bidsOrders={bidsOrderNormalized}
                    asksOrders={asksOrderNormalized}
                    spread={spread}
                    aggregated={this.props.exchange.orderBookAggregated}
                    onToggleAggregateOrders={this.onToggleAggregateOrders}
                    onlyAggregated={
                      this.props.exchange.selectedRelay.onlyAggregateOrderbook
                    }
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {notificationsOpen ? (
                <ElementNotificationsDrawer
                  handleToggleNotifications={handleToggleNotifications}
                  notificationsOpen={notificationsOpen}
                />
              ) : null}
            </Col>
          </Row>
          <ElementBottomStatusBar
            blockNumber={endpoint.prevBlockNumber}
            networkName={endpoint.networkInfo.name}
            networkError={endpoint.networkError}
            networkStatus={endpoint.networkStatus}
          />
        </div>
      )
    }

    if (!user.isManager) {
      return (
        <div ref={node => (this.node = node)}>
          <Row className={styles.maincontainer}>
            <Col xs={12}>Only wizards can access this section.</Col>
          </Row>
          <Row>
            <Col xs={12}>
              {notificationsOpen ? (
                <ElementNotificationsDrawer
                  handleToggleNotifications={handleToggleNotifications}
                  notificationsOpen={notificationsOpen}
                />
              ) : null}
            </Col>
          </Row>
          <ElementBottomStatusBar
            blockNumber={endpoint.prevBlockNumber}
            networkName={endpoint.networkInfo.name}
            networkError={endpoint.networkError}
            networkStatus={endpoint.networkStatus}
          />
        </div>
      )
    }
  }

  // onNewEventZeroExExchange = (error, event) => {

  // }

  // Getting last transactions
  getSelectedFundDetails = async (dragoAddress, accounts) => {
    console.log(dragoAddress, accounts)
    const { api } = this.context
    // const options = {balance: false, supply: true}
    const options = { balance: false, supply: true, limit: 10, trader: false }
    try {
      const results = await utils.getTransactionsDragoOptV2(
        api,
        dragoAddress,
        accounts,
        options
      )
      const createdLogs = results[1].filter(event => {
        return event.type !== 'BuyDrago' && event.type !== 'SellDrago'
      })
      // console.log(results)
      results[1] = createdLogs
      results[2].sort(function(a, b) {
        let keyA = a.symbol,
          keyB = b.symbol
        // Compare the 2 dates
        if (keyA < keyB) return -1
        if (keyA > keyB) return 1
        return 0
      })
      this.props.dispatch(
        Actions.drago.updateTransactionsDragoManagerAction(results)
      )

      if (results[2].length !== 0) {
        // Getting fund orders
        // this.props.dispatch(this.getFundOrders(
        //   this.props.exchange.relay.networkId,
        //   results[2][0].address.toLowerCase(),
        //   this.props.exchange.selectedTokensPair.baseToken.address,
        //   this.props.exchange.selectedTokensPair.quoteToken.address,
        // )
        // )
        console.log(`Selecting fund ${results[2][0].address.toLowerCase()}`)
        this.onSelectFund(results[2][0])
      } else {
        this.setState({
          managerHasNoFunds: true
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

export default connect(mapStateToProps)(ApplicationExchangeHome)
