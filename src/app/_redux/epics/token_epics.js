// Copyright 2016-2017 Rigo Investment Sagl.

import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/bufferTime'
import 'rxjs/add/operator/concat'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/exhaustMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/mergeMap'
import { Observable } from 'rxjs/Observable'

import 'rxjs/observable/timer'
import { setTokenAllowance } from '../../_utils/exchange'
// import { fromPromise } from 'rxjs/add/observable/fromPromise';
import {
  FETCH_CANDLES_DATA_PORTFOLIO_START,
  FETCH_CANDLES_DATA_PORTFOLIO_STOP,
  QUEUE_ERROR_NOTIFICATION,
  SET_TOKEN_ALLOWANCE,
  TOKENS_TICKERS_UPDATE,
  TOKEN_PRICE_TICKERS_FETCH_START,
  TOKEN_PRICE_TICKERS_FETCH_STOP,
  UPDATE_SELECTED_DRAGO_DETAILS_CHART_ASSETS_MARKET_ADD_DATAPOINT,
  UPDATE_SELECTED_DRAGO_DETAILS_CHART_ASSETS_MARKET_DATA_INIT,
  UPDATE_TRADE_TOKENS_PAIR
} from '../actions/const'
import Exchange from '../../_utils/exchange/src/index'
import utils from '../../_utils/utils'

// Setting allowance for a token
const setTokenAllowance$ = (
  tokenAddress,
  ownerAddress,
  spenderAddress,
  ZeroExConfig
) =>
  Observable.fromPromise(
    setTokenAllowance(tokenAddress, ownerAddress, spenderAddress, ZeroExConfig)
  )

export const setTokenAllowanceEpic = action$ => {
  return action$.ofType(SET_TOKEN_ALLOWANCE).mergeMap(action => {
    return setTokenAllowance$(
      action.payload.tokenAddress,
      action.payload.ownerAddress,
      action.payload.spenderAddress,
      action.payload.ZeroExConfig
    ).map(() => {
      return {
        type: UPDATE_TRADE_TOKENS_PAIR,
        payload: { baseTokenAllowance: true }
      }
    })
  })
}

//
// FETCH WS CANDLES DATA FOR A GROUP TRADING PAIRS
//
// PRICES ON THE FUNDS PAGE ARE FETCHED FROM ETHFINEX ONLY

const candlesGroupWebsocket$ = (relay, networkId, symbols) => {
  return Observable.create(observer => {
    let subscribedSymbols = Array(0)
    const exchange = new Exchange(relay.name, networkId, 'ws')
    const websocket = exchange.getHistoricalPricesData(
      // utils.getTockenSymbolForRelay(relay.name, baseToken),
      // utils.getTockenSymbolForRelay(relay.name, quoteToken),
      'test',
      'test',
      '1m'
    )
    symbols.push('tETHUSD')
    websocket.addEventListener('open', function() {
      symbols.forEach(function(symbol) {
        let msg = JSON.stringify({
          event: `subscribe`,
          channel: `candles`,
          key: `trade:15m:${symbol}`
        })
        websocket.send(msg)
      })
    })
    websocket.onmessage = msg => {
      // console.log('WebSocket message.');
      let data = JSON.parse(msg.data)
      if (typeof data.event !== undefined) {
        if (data.event === 'subscribed') {
          subscribedSymbols[data.chanId] = data.key.split(':t')[1].slice(0, -3)
        }
      }
      if (Array.isArray(data)) {
        return observer.next([subscribedSymbols[data[0]], data[1]])
      }
    }
    websocket.onclose = msg => {
      console.log(`Candle WS closed`)
      return msg.wasClean ? observer.complete() : null
    }
    websocket.onerror = error => {
      // console.log(error)
      console.log('WebSocket error.')
      return observer.error(error)
    }
    return () => websocket.close(1000, 'Closed by client', { keepClosed: true })
  })
}

const updateGroupCandles = ticker => {
  const USDT = 'USDT'
  let symbol = ticker[0]
  let now = new Date()
  let yesterday = now.setDate(now.getDate() - 1)

  const convertToETH = (symbol, value) => {
    return symbol === USDT ? 1 / value : value
  }
  // We need to express USD valuation in ETH
  symbol === 'ETH' ? (symbol = USDT) : null
  console.log(symbol)
  // INITIAL SHAPSHOT
  if (Array.isArray(ticker[1][0])) {
    console.log('snapshot:', ticker)
    let candles = ticker[1]
      .filter(tick => {
        return tick[0] >= yesterday
      })
      .map(tick => {
        let entry = {
          date: new Date(tick[0]),
          low: convertToETH(symbol, tick[4]),
          high: convertToETH(symbol, tick[3]),
          open: convertToETH(symbol, tick[1]),
          close: convertToETH(symbol, tick[2]),
          volume: convertToETH(symbol, tick[5]),
          epoch: tick[0]
        }
        return entry
      })
    return {
      type: UPDATE_SELECTED_DRAGO_DETAILS_CHART_ASSETS_MARKET_DATA_INIT,
      payload: {
        [symbol]: { data: candles.reverse() }
      }
    }
  }

  // UPDATE
  if (!Array.isArray[ticker[1][0]]) {
    // console.log(`${ticker[1][0]} -> ${date}`)
    // console.log(new Date(ticker[1][0]))
    console.log('update:', ticker)
    let candles = {
      date: new Date(ticker[1][0]),
      low: convertToETH(symbol, ticker[1][4]),
      high: convertToETH(symbol, ticker[1][3]),
      open: convertToETH(symbol, ticker[1][1]),
      close: convertToETH(symbol, ticker[1][2]),
      volume: convertToETH(symbol, ticker[1][5]),
      epoch: ticker[1][0]
    }
    return {
      type: UPDATE_SELECTED_DRAGO_DETAILS_CHART_ASSETS_MARKET_ADD_DATAPOINT,
      payload: {
        [symbol]: { data: candles }
      }
    }
  }
}

export const getCandlesGroupDataEpic = (action$, state$) => {
  return action$.ofType(FETCH_CANDLES_DATA_PORTFOLIO_START).mergeMap(action => {
    return Observable.concat(
      // Observable.of({ type: UPDATE_ELEMENT_LOADING, payload: { marketBox: true } }),
      candlesGroupWebsocket$(
        action.payload.relay,
        action.payload.networkId,
        utils.ethfinexTickersToArray(
          state$.value.transactionsDrago.selectedDrago.assets
        ),
        action.payload.startDate
      )
        .takeUntil(action$.ofType(FETCH_CANDLES_DATA_PORTFOLIO_STOP))
        .filter(val => {
          return val[1] !== 'hb'
        })
        .filter(val => {
          return val[1].length !== 0
        })
        .do(val => {
          return val
        })
        .map(historical => {
          return updateGroupCandles(historical)
        })
        .catch(error => {
          console.warn(error)
          return Observable.of({
            type: QUEUE_ERROR_NOTIFICATION,
            payload: 'Error fetching candles data.'
          })
        })
      // Observable.of({ type: UPDATE_ELEMENT_LOADING, payload: { marketBox: false } }),
    )
  })
}

//
// FETCH REST TICKERS DATA FOR A GROUP TRADING PAIRS
//
// PRICES ON THE FUNDS PAGE ARE FETCHED FROM ETHFINEX ONLY

const getTickers$ = (relay, networkId, tickersString) => {
  const exchange = new Exchange(relay.name, networkId)
  return Observable.fromPromise(exchange.getTickers(tickersString))
  // .catch((error) => {
  //   console.log(error)
  //   return Observable.of(Array(0))
  // })
}

export const getPricesEpic = (action$, state$) =>
  action$.ofType(TOKEN_PRICE_TICKERS_FETCH_START).switchMap(action => {
    return Observable.timer(0, 10000)
      .takeUntil(action$.ofType(TOKEN_PRICE_TICKERS_FETCH_STOP))
      .exhaustMap(() => {
        const currentState = state$.value
        const tickersString = utils
          .ethfinexTickersToArray(
            currentState.transactionsDrago.selectedDrago.assets
          )
          .toString()
        return getTickers$(
          action.payload.relay,
          action.payload.networkId,
          tickersString
        )
          .map(message => {
            try {
              const arrayToObject = (arr, keyField) =>
                Object.assign(
                  {},
                  ...arr.map(item => ({ [item[keyField]]: item }))
                )
              const tokenList = arrayToObject(message, 'symbol')
              return tokenList
            } catch (err) {
              return {}
            }
          })
          .map(payload => ({ type: TOKENS_TICKERS_UPDATE, payload }))
          .catch(() => {
            return Observable.of({
              type: QUEUE_ERROR_NOTIFICATION,
              payload: 'Error fetching tickers data.'
            })
          })
      })
      .catch(() => {
        return Observable.of({
          type: QUEUE_ERROR_NOTIFICATION,
          payload: 'Error fetching tickers data.'
        })
      })
  })
