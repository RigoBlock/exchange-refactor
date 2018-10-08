// Copyright 2016-2017 Rigo Investment Sagl.

import * as TYPE_ from './const'

const exchange = {
  getAccountOrders: (relay, networkId, account, baseToken, quoteToken) => {
    const payload = {
      relay,
      networkId,
      account,
      baseToken,
      quoteToken
    }
    return {
      type: TYPE_.FETCH_ACCOUNT_ORDERS,
      payload: payload
    }
  },
  fetchCandleDataSingle: (
    relay,
    networkId,
    baseToken,
    quoteToken,
    startDate
  ) => {
    const payload = {
      relay,
      networkId,
      baseToken,
      quoteToken,
      startDate
    }
    return {
      type: TYPE_.FETCH_CANDLES_DATA_SINGLE,
      payload: payload
    }
  },
  // Starts collecting chart data for Drago details pages
  getPortfolioChartDataStart: (relay, networkId, startDate) => {
    const payload = {
      relay,
      networkId,
      startDate
    }
    return {
      type: TYPE_.FETCH_CANDLES_DATA_PORTFOLIO_START,
      payload: payload
    }
  },
  // Stops collecting chart data for Drago details pages
  getPortfolioChartDataStop: () => {
    return {
      type: TYPE_.FETCH_CANDLES_DATA_PORTFOLIO_STOP
    }
  },
  getTradeHistoryLogs: (networkId, baseTokenAddress, quoteTokenAddress) => {
    const payload = {
      networkId,
      baseTokenAddress,
      quoteTokenAddress
    }
    return {
      type: TYPE_.FETCH_HISTORY_TRANSACTION_LOGS,
      payload: payload
    }
  },
  relayCloseWs: () => {
    return {
      type: TYPE_.RELAY_CLOSE_WEBSOCKET,
      payload: {}
    }
  },
  relayGetOrders: (relay, networkId, baseToken, quoteToken, aggregated) => {
    return {
      type: TYPE_.RELAY_GET_ORDERS,
      payload: {
        relay,
        networkId,
        baseToken,
        quoteToken,
        aggregated
      }
    }
  },
  relayOpenWs: (relay, networkId, baseToken, quoteToken) => {
    return {
      type: TYPE_.RELAY_OPEN_WEBSOCKET,
      payload: {
        relay,
        networkId,
        baseToken,
        quoteToken
      }
    }
  },
  setAggregateOrders: isInputChecked => {
    return {
      type: TYPE_.SET_ORDERBOOK_AGGREGATE_ORDERS,
      payload: isInputChecked
    }
  },
  updateSelectedRelay: payload => {
    return {
      type: TYPE_.UPDATE_SELECTED_RELAY,
      payload: payload
    }
  },
  updateSelectedExchange: payload => {
    return {
      type: TYPE_.UPDATE_SELECTED_EXCHANGE,
      payload: payload
    }
  },
  updateSelectedTradeTokensPair: tradeTokensPair => {
    return {
      type: TYPE_.UPDATE_TRADE_TOKENS_PAIR,
      payload: tradeTokensPair
    }
  },
  updateAvailableTradeTokensPairs: payload => {
    return {
      type: TYPE_.UPDATE_AVAILABLE_TRADE_TOKENS_PAIRS,
      payload: payload
    }
  },

  updateLiquidityAndTokenBalances: (api, task, dragoAddress) => {
    switch (task) {
      case 'START':
        return {
          type: TYPE_.UPDATE_LIQUIDITY_AND_TOKENS_BALANCE_START,
          payload: {
            api
            // dragoAddress
          }
        }
      case 'STOP':
        return {
          type: TYPE_.UPDATE_LIQUIDITY_AND_TOKENS_BALANCE_STOP,
          payload: {
            api
            // dragoAddress
          }
        }
      default:
        return {
          type: TYPE_.UPDATE_LIQUIDITY_AND_TOKENS_BALANCE,
          payload: {
            api,
            dragoAddress
          }
        }
    }
  },
  updateAvailableRelays: payload => {
    return {
      type: TYPE_.UPDATE_AVAILABLE_RELAYS,
      payload: payload
    }
  },
  updateAccountSignature: payload => {
    return {
      type: TYPE_.UPDATE_ACCOUNT_SIGNATURE,
      payload: payload
    }
  }
}

export default exchange
