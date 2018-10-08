// Copyright 2016-2017 Rigo Investment Sagl.

// import { Observable } from 'rxjs';
import { Observable } from 'rxjs'
// import 'rxjs/add/observable/dom/webSocket';
import 'rxjs/add/operator/bufferCount'
import 'rxjs/add/operator/bufferTime'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/last'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/reduce'
import 'rxjs/add/operator/retryWhen'
import 'rxjs/add/operator/skip'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/takeLast'
import 'rxjs/add/operator/takeUntil'
// import 'rxjs/add/operator/catchError';
import 'rxjs/add/observable/concat'
import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/of'
import 'rxjs/observable/fromEvent'
import 'rxjs/observable/timer'
// import { timer } from 'rxjs/observable/timer'
import 'rxjs/add/observable/forkJoin'
import Exchange from '../../../_utils/exchange/src'
import utils from '../../../_utils/utils'
// import { catchError } from 'rxjs/operators';
// import { catchError } from 'rxjs/operators';

import { Actions } from '../../actions/'
import { Ethfinex } from '../../../_utils/const'


import {
  CHART_MARKET_DATA_ADD_DATAPOINT,
  CHART_MARKET_DATA_INIT,
  FETCH_ACCOUNT_ORDERS,
  FETCH_ACCOUNT_ORDERS_STOP,
  FETCH_CANDLES_DATA_SINGLE,
  // UPDATE_ELEMENT_LOADING,
  // CHART_MARKET_DATA_UPDATE,
  QUEUE_ERROR_NOTIFICATION,
  RELAY_CLOSE_WEBSOCKET,
  RELAY_GET_ORDERS,
  RELAY_MSG_FROM_WEBSOCKET,
  RELAY_OPEN_WEBSOCKET,
  UPDATE_CURRENT_TOKEN_PRICE,
  UPDATE_FUND_ORDERS
} from '../../actions/const'

const customRelayAction = action => {
  // console.log(`${Ethfinex.toUpperCase()}_${action}`)
  return `${Ethfinex.toUpperCase()}_${action}`
}

//
// FETCH HISTORICAL MARKET DATA FOR A SPECIFIC TRADING PAIR
//

const candlesSingleWebsocket$ = (relay, networkId, baseToken, quoteToken) => {
  return Observable.create(observer => {
    // const relay = {
    //   name: 'Ethfinex'
    // }
    console.log('candles')
    const exchange = new Exchange(relay.name, networkId, 'ws')
    const websocket = exchange.getHistoricalPricesData(
      // utils.getTockenSymbolForRelay(relay.name, baseToken),
      // utils.getTockenSymbolForRelay(relay.name, quoteToken),
      'test',
      'test',
      '1m'
    )
    const baseTokenSymbol = utils.getTockenSymbolForRelay(relay.name, baseToken)
    const quoteTokenSymbol = utils.getTockenSymbolForRelay(
      relay.name,
      quoteToken
    )
    websocket.addEventListener('open', () => {
      let msg = JSON.stringify({
        event: `subscribe`,
        channel: `candles`,
        key: `trade:1m:t${baseTokenSymbol}${quoteTokenSymbol}`
      })
      websocket.send(msg)
    })

    websocket.onmessage = msg => {
      // console.log('WebSocket message.');
      // console.log(msg)
      return observer.next(msg.data)
    }
    websocket.onclose = msg => {
      // websocket.send(`unsub:ticker`);
      console.log(`Candle WS closed`)
      // console.log(msg)
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

const updateSingleCandles = tickerOutput => {
  let ticker = JSON.parse(tickerOutput)
  // console.log(ticker)
  // console.log(Array.isArray(ticker))

  if (ticker[1].length !== 6 && ticker[1] !== 'hb') {
    let candles = ticker[1].map(tick => {
      let entry = {
        date: new Date(tick[0]),
        low: tick[4],
        high: tick[3],
        open: tick[1],
        close: tick[2],
        volume: tick[5],
        epoch: tick[0]
      }
      return entry
    })
    return {
      type: CHART_MARKET_DATA_INIT,
      payload: candles.reverse()
    }
  }
  if (ticker[1].length === 6 && ticker[1] !== 'hb') {
    // console.log(`${ticker[1][0]} -> ${date}`)
    // console.log(new Date(ticker[1][0]))
    let candles = {
      date: new Date(ticker[1][0]),
      low: ticker[1][4],
      high: ticker[1][3],
      open: ticker[1][1],
      close: ticker[1][2],
      volume: ticker[1][5],
      epoch: ticker[1][0]
    }

    return {
      type: CHART_MARKET_DATA_ADD_DATAPOINT,
      payload: candles
    }
  }
  return {
    type: CHART_MARKET_DATA_ADD_DATAPOINT,
    payload: ''
  }
}

export const getCandlesSingleDataEpic = action$ => {
  return action$
    .ofType(customRelayAction(FETCH_CANDLES_DATA_SINGLE))
    .mergeMap(action => {
      console.log(action)
      return Observable.concat(
        // Observable.of({ type: UPDATE_ELEMENT_LOADING, payload: { marketBox: true } }),
        candlesSingleWebsocket$(
          action.payload.relay,
          action.payload.networkId,
          action.payload.baseToken,
          action.payload.quoteToken,
          action.payload.startDate
        )
          .takeUntil(action$.ofType(customRelayAction(RELAY_CLOSE_WEBSOCKET)))
          .skip(2)
          .filter(val => {
            let tick = JSON.parse(val)
            return tick[1] !== 'hb'
          })
          .filter(val => {
            let tick = JSON.parse(val)
            return (
              typeof tick[1] !== 'undefined' || typeof tick[0] !== 'undefined'
            )
          })
          .do(val => {
            // console.log(val)
            return val
          })
          .map(historical => {
            return updateSingleCandles(historical)
          })
          .catch(() => {
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
// CONNECTING TO WS AND GETTING UPDATES FOR A SPECIFIC TRADING PAIR
//

const reconnectingWebsocket$ = (relay, networkId, baseToken, quoteToken) => {
  return Observable.create(observer => {
    const exchange = new Exchange(relay.name, networkId, 'ws')
    const websocket = exchange.getTicker(
      utils.getTockenSymbolForRelay(relay.name, baseToken),
      utils.getTockenSymbolForRelay(relay.name, quoteToken)
    )
    websocket.onmessage = msg => {
      // console.log('WebSocket message.');
      // console.log(msg)
      return observer.next(msg.data)
    }
    websocket.onclose = msg => {
      // websocket.send(`unsub:ticker`);
      console.log(msg)
      return msg.wasClean ? observer.complete() : null
    }
    websocket.onerror = error => {
      console.log(error)
      console.log('WebSocket error.')
      return observer.error(error)
    }
    return () => websocket.close(1000, 'Closed by client', { keepClosed: true })
  })
}

export const initRelayWebSocketEpic = action$ =>
  action$.ofType(customRelayAction(RELAY_OPEN_WEBSOCKET)).mergeMap(action => {
    return reconnectingWebsocket$(
      action.payload.relay,
      action.payload.networkId,
      action.payload.baseToken,
      action.payload.quoteToken
    )
      .takeUntil(action$.ofType(customRelayAction(RELAY_CLOSE_WEBSOCKET)))
      .map(payload => ({
        type: customRelayAction(RELAY_MSG_FROM_WEBSOCKET),
        payload
      }))
      .catch(() => {
        return Observable.of({
          type: QUEUE_ERROR_NOTIFICATION,
          payload: 'Error connecting to price ticker.'
        })
      })
  })

//
// FETCHING THE ORDER BOOK AND UPDATING THE CURRENT PRICE FOR A SPECIFIC TRADING PAIR
//

const updateCurrentTokenPrice = tickerOutput => {
  let ticker = JSON.parse(tickerOutput)
  // console.log(ticker)
  if (Array.isArray(ticker[1])) {
    let current = {
      price: ticker[1][6]
    }
    return {
      type: UPDATE_CURRENT_TOKEN_PRICE,
      payload: {
        current
      }
    }
  } else {
    return {
      type: UPDATE_CURRENT_TOKEN_PRICE,
      payload: {}
    }
  }
}

export const orderBookEpic = (action$, state$) => {
  return action$
    .ofType(customRelayAction(RELAY_MSG_FROM_WEBSOCKET))
    .map(action => action.payload)
    .bufferTime(1000)
    .filter(value => {
      return value.length !== 0
    })
    .bufferCount(1)
    .map(ticker => {
      // console.log(customRelayAction((RELAY_MSG_FROM_WEBSOCKET)))
      const currentState = state$.value
      const lastItem = ticker[0].pop()
      // return [ lastItem, currentState ]
      return {
        item: lastItem,
        state: currentState
      }
    })
    .do(val => {
      // console.log(val)
      return val
    })
    .switchMap(ticker =>
      Observable.of(
        {
          type: RELAY_GET_ORDERS,
          payload: {
            relay: ticker.state.exchange.selectedRelay,
            networkId: ticker.state.endpoint.networkInfo.id,
            baseToken: ticker.state.exchange.selectedTokensPair.baseToken,
            quoteToken: ticker.state.exchange.selectedTokensPair.quoteToken,
            aggregated: ticker.state.exchange.orderBookAggregated
          }
        },
        updateCurrentTokenPrice(
          ticker.item,
          ticker.state.exchange.selectedTokensPair.baseToken
        )
      )
    )
}

//
// FETCH OPEN ORDERS
//

const getAccountOrdersFromRelay$ = (
  relay,
  networkId,
  account,
  baseToken,
  quoteToken
) => {
  const exchange = new Exchange(relay.name, networkId)
  console.log('orders open')
  return Observable.fromPromise(
    exchange.getAccountOrders(account, baseToken, quoteToken)
  )
}

export const getAccountOrdersEpic = action$ => {
  return action$
    .ofType(customRelayAction(FETCH_ACCOUNT_ORDERS))
    .mergeMap(action => {
      console.log('orders')
      console.log(customRelayAction(FETCH_ACCOUNT_ORDERS))
      return Observable.concat(
        // Observable.of({ type: UPDATE_ELEMENT_LOADING, payload: { marketBox: true }}),

        Observable.timer(0, 5000)
          .takeUntil(
            action$.ofType(customRelayAction(FETCH_ACCOUNT_ORDERS_STOP))
          )
          .exhaustMap(() =>
            getAccountOrdersFromRelay$(
              action.payload.relay,
              action.payload.networkId,
              action.payload.account,
              action.payload.quoteToken,
              action.payload.baseToken
            )
              .map(orders => {
                console.log(orders)
                return {
                  type: UPDATE_FUND_ORDERS,
                  payload: {
                    open: orders
                  }
                }
              })
              .catch(() => {
                return Observable.concat(
                  Observable.of({
                    type: QUEUE_ERROR_NOTIFICATION,
                    payload: 'Error fetching account orders.'
                  }),
                  Observable.of(
                    Actions.exchange.updateAccountSignature({ valid: false })
                  )
                )
              })
          )
        // Observable.of({ type: UPDATE_ELEMENT_LOADING, payload: { marketBox: false }}),
      )
    })
}
