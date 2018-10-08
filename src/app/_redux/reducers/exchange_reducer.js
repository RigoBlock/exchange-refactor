// Copyright 2016-2017 Rigo Investment Sagl.

import * as TYPE_ from '../actions/const'
import BigNumber from 'bignumber.js'
import initialState from './initialState'

function exchangeReducer(state = initialState.exchange, action) {
  switch (action.type) {
    case TYPE_.UPDATE_FUND_ORDERS:
      return {
        ...state,
        fundOrders: { ...state.fundOrders, ...action.payload }
      }

    case TYPE_.CHART_MARKET_DATA_UPDATE:
      if (action.payload !== '') {
        return {
          ...state,
          chartData: action.payload
        }
      } else {
        return {
          ...state
        }
      }

    case TYPE_.CHART_MARKET_DATA_INIT:
      if (action.payload !== '') {
        return {
          ...state,
          chartData: action.payload
        }
      } else {
        return {
          ...state
        }
      }

    case TYPE_.CHART_MARKET_DATA_ADD_DATAPOINT:
      let newChartData = [...state.chartData]
      if (
        action.payload.epoch === newChartData[newChartData.length - 1].epoch
      ) {
        newChartData[newChartData.length - 1] = action.payload
        // console.log('first')
        return {
          ...state,
          chartData: newChartData
        }
      }
      if (
        action.payload.epoch === newChartData[newChartData.length - 2].epoch
      ) {
        // console.log('second')
        newChartData[newChartData.length - 2] = action.payload
        return {
          ...state,
          chartData: newChartData
        }
      }
      // console.log('***** NEW *****')
      newChartData.push(action.payload)
      return {
        ...state,
        chartData: newChartData
      }

    case TYPE_.UPDATE_ELEMENT_LOADING:
      const elementLoading = action.payload
      return {
        ...state,
        loading: { ...state.loading, ...elementLoading }
      }

    case TYPE_.UPDATE_SELECTED_FUND:
      return {
        ...state,
        selectedFund: { ...state.selectedFund, ...action.payload }
      }

    case TYPE_.UPDATE_SELECTED_RELAY:
      return {
        ...state,
        selectedRelay: { ...state.selectedRelay, ...action.payload }
      }

    case TYPE_.UPDATE_SELECTED_EXCHANGE:
      return {
        ...state,
        selectedExchange: { ...state.selectedExchange, ...action.payload }
      }

    case TYPE_.UPDATE_SELECTED_ORDER:
      let orderDetails = action.payload
      let selectedOrder = { ...state.selectedOrder, ...orderDetails }
      return {
        ...state,
        selectedOrder: selectedOrder
      }

    case TYPE_.UPDATE_TRADE_TOKENS_PAIR:
      return {
        ...state,
        selectedTokensPair: { ...state.selectedTokensPair, ...action.payload }
      }

    case TYPE_.UPDATE_AVAILABLE_TRADE_TOKENS_PAIRS:
      return {
        ...state,
        availableTradeTokensPairs: { ...action.payload }
      }

    case TYPE_.UPDATE_AVAILABLE_RELAYS:
      return {
        ...state,
        availableRelays: action.payload
      }

    case TYPE_.UPDATE_ACCOUNT_SIGNATURE:
      return {
        ...state,
        accountSignature: { ...state.accountSignature, ...action.payload }
      }

    case TYPE_.SET_MAKER_ADDRESS:
      return {
        ...state,
        walletAddress: action.payload,
        walletSelectedAddress: action.payload
      }

    case TYPE_.CANCEL_SELECTED_ORDER:
      return {
        ...state,
        selectedOrder: initialState.exchange.selectedOrder
      }

    case TYPE_.SET_ORDERBOOK_AGGREGATE_ORDERS:
      return {
        ...state,
        orderBookAggregated: action.payload
      }

    case TYPE_.ORDERBOOK_INIT:
      const newOrderBook = { ...state.orderBook, ...action.payload }
      return {
        ...state,
        orderBook: newOrderBook
      }

    case TYPE_.ORDERBOOK_UPDATE:
      return { ...state, webSocket: { ...action.payload } }

    case TYPE_.TOKENS_TICKERS_UPDATE:
      let prices = {
        ...action.payload,
        previous: { ...state.prices }
      }
      return { ...state, prices }

    case TYPE_.UPDATE_CURRENT_TOKEN_PRICE:
      let ticker
      if (typeof action.payload.current !== 'undefined') {
        ticker = {
          current: action.payload.current,
          previous: { ...state.selectedTokensPair.ticker.current }
        }
        let currentPrice = new BigNumber(ticker.current.price)
        let previousPrice = new BigNumber(ticker.previous.price)
        if (!previousPrice.eq(0)) {
          ticker.variation = currentPrice
            .minus(previousPrice)
            .dividedBy(previousPrice)
            .multipliedBy(100)
            .toFixed(4)
        } else {
          ticker.variation = 0
        }
      } else {
        ticker = {
          current: { ...state.selectedTokensPair.ticker.current },
          previous: { ...state.selectedTokensPair.ticker.current },
          variation: state.selectedTokensPair.ticker.variation
        }
      }
      return {
        ...state,
        selectedTokensPair: {
          ...state.selectedTokensPair,
          ticker: { ...ticker }
        }
      }

    default:
      return state
  }
}

export default exchangeReducer
