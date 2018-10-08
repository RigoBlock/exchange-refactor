// Copyright 2016-2017 Rigo Investment Sagl.

import 'rxjs/add/observable/concat'
import 'rxjs/add/observable/dom/webSocket'
import 'rxjs/add/observable/forkJoin'
// import 'rxjs/add/observable/fromPromise'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/bufferCount'
import 'rxjs/add/operator/bufferTime'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/reduce'
import 'rxjs/add/operator/retryWhen'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/observable/fromEvent'
import 'rxjs/observable/timer'
import * as ERRORS from '../../_const/errors'
import * as TYPE_ from '../actions/const'
import { Actions } from '../actions/'
import { Observable, from } from 'rxjs'
import {
  catchError,
  concat,
  exhaustMap,
  map,
  mergeMap,
  skipWhile,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators'
import {
  // getHistoricalPricesDataFromERCdEX,
  getTradeHistoryLogsFromRelayERCdEX
} from '../../_utils/exchange'
import { ofType } from 'redux-observable'
import Exchange from '../../_utils/exchange/src/index'
import exchangeConnector, {
  NETWORKS,
  exchanges,
  supportedExchanges
} from '@rigoblock/exchange-connector'
import utils from '../../_utils/utils'

export * from './exchanges'

//
// GETTING ORDERS FROM RELAY
//

// Creating an observable from the promise
const getOrderBookFromRelay$ = (
  relay,
  networkId,
  baseToken,
  quoteToken,
  aggregated
) => {
  const ethfinex = exchangeConnector(supportedExchanges.ETHFINEX, {
    networkId: NETWORKS.ROPSTEN
  })
  ethfinex.http
    .getOrders({
      symbols: 'ETHUSD',
      precision: exchanges[supportedExchanges.ETHFINEX_RAW].OrderPrecisions.P4
    })
    .then(orders => {
      console.log(orders)
    })

  if (aggregated) {
    const exchange = new Exchange(relay.name, networkId)
    return from(
      exchange.getAggregatedOrders(
        utils.getTockenSymbolForRelay(relay.name, baseToken),
        utils.getTockenSymbolForRelay(relay.name, quoteToken)
      )
    )
  } else {
    const exchange = new Exchange(relay.name, networkId)
    return from(
      exchange.getOrders(
        utils.getTockenSymbolForRelay(relay.name, baseToken),
        utils.getTockenSymbolForRelay(relay.name, quoteToken)
      )
    )
  }
}

// Setting the epic
export const getOrderBookFromRelayEpic = action$ => {
  return action$.ofType(TYPE_.RELAY_GET_ORDERS).mergeMap(action => {
    return getOrderBookFromRelay$(
      action.payload.relay,
      action.payload.networkId,
      action.payload.baseToken,
      action.payload.quoteToken,
      action.payload.aggregated
    ).pipe(
      map(payload => {
        // const aggregate = { aggregated: action.payload.aggregated }
        return { type: TYPE_.ORDERBOOK_INIT, payload: { ...payload } }
      }),
      catchError(error => {
        console.log(error)
        return Observable.of({
          type: TYPE_.QUEUE_ERROR_NOTIFICATION,
          payload: ERRORS.E001
        })
      })
    )
  })
}

//
// UPDATE TOKEN WRAPPER LOCK TIME
//

// const updateTokenWrapperLockTime$ = (fundAddress, api) =>
//   Observable.fromPromise(utils.getDragoLiquidity(fundAddress, api)).map(
//     liquidity => {
//       const payload = {
//         liquidity: {
//           ETH: liquidity[0],
//           WETH: liquidity[1],
//           ZRX: liquidity[2]
//         }
//       }
//       return {
//         type: TYPE_.UPDATE_SELECTED_FUND,
//         payload: payload
//       }
//     }
//   )

// export const updateTokenWrapperLockTimeEpic = action$ => {
//   return action$.pipe(
//     ofType(TYPE_.UPDATE_TOKEN_WRAPPER_LOCK_TIME),
//     switchMap(action => {
//       return updateTokenWrapperLockTime$(action.payload.api, action.payload.api)
//     })
//   )
// }

//
// UPDATE FUND LIQUIDITY
//

const updateFundLiquidity$ = (fundAddress, api) =>
  Observable.fromPromise(utils.getDragoLiquidity(fundAddress, api)).map(
    liquidity => {
      const payload = {
        liquidity: {
          ETH: liquidity[0]
          // WETH: liquidity[1],
          // ZRX: liquidity[2]
        }
      }
      return {
        type: TYPE_.UPDATE_SELECTED_FUND,
        payload: payload
      }
    }
  )

export const updateFundLiquidityEpic = action$ => {
  return action$.ofType(TYPE_.UPDATE_FUND_LIQUIDITY).mergeMap(action => {
    return Observable.concat(
      Observable.of({
        type: TYPE_.UPDATE_ELEMENT_LOADING,
        payload: { liquidity: true }
      }),
      updateFundLiquidity$(action.payload.fundAddress, action.payload.api),
      Observable.of({
        type: TYPE_.UPDATE_ELEMENT_LOADING,
        payload: { liquidity: false }
      })
    )
  })
}

//
// UPDATE LIQUIDITY AND TOKEN BALANCES IN FUND
//

const updateLiquidityAndTokenBalances$ = (api, fundAddress, currentState) => {
  // const tokens = {
  //   baseToken: currentState.exchange.selectedTokensPair.baseToken,
  //   quoteToken: currentState.exchange.selectedTokensPair.quoteToken
  // }
  const exchange = Object.assign(currentState.exchange.selectedRelay.name)
  const selectedTokensPair = Object.assign(
    currentState.exchange.selectedTokensPair
  )
  return Observable.fromPromise(
    utils.fetchDragoLiquidityAndTokenBalances(
      fundAddress,
      api,
      selectedTokensPair,
      exchange
    )
  ).pipe(
    mergeMap(liquidity => {
      const payload = {
        loading: false,
        liquidity: {
          ETH: liquidity.dragoETHBalance,
          // ZRX: liquidity.dragoZRXBalance,
          baseToken: {
            balance: liquidity.baseTokenBalance,
            balanceWrapper: liquidity.baseTokenWrapperBalance
          },
          quoteToken: {
            balance: liquidity.quoteTokenBalance,
            balanceWrapper: liquidity.quoteTokenWrapperBalance
          }
        }
      }
      return Observable.concat(
        Observable.of({
          type: TYPE_.UPDATE_SELECTED_FUND,
          payload
        })
        // Observable.of(
        //   Actions.exchange.updateSelectedTradeTokensPair({
        //     baseTokenLockWrapExpire: liquidity.baseTokenLockWrapExpire,
        //     quoteTokenLockWrapExpire: liquidity.quoteTokenLockWrapExpire
        //   })
        // )
      )
    })
  )
}

export const getLiquidityAndTokenBalancesEpic = (action$, state$) => {
  return action$.pipe(
    ofType(TYPE_.UPDATE_LIQUIDITY_AND_TOKENS_BALANCE),
    exhaustMap(action => {
      const currentState = state$.value
      return updateLiquidityAndTokenBalances$(
        action.payload.api,
        action.payload.dragoAddress,
        currentState
      )
    })
  )
}

export const updateLiquidityAndTokenBalancesEpic = (action$, state$) => {
  return action$.pipe(
    ofType(TYPE_.UPDATE_LIQUIDITY_AND_TOKENS_BALANCE_START),
    switchMap(action => {
      return Observable.timer(0, 10000).pipe(
        tap(val => {
          console.log('update liquidity')
          return val
        }),
        takeUntil(
          action$.pipe(ofType(TYPE_.UPDATE_LIQUIDITY_AND_TOKENS_BALANCE_STOP))
        ),
        skipWhile(
          () =>
            typeof state$.value.exchange.selectedFund.details.address ===
            'undefined'
        ),
        exhaustMap(() => {
          const currentState = state$.value
          return updateLiquidityAndTokenBalances$(
            action.payload.api,
            currentState.exchange.selectedFund.details.address,
            currentState
          )
        })
      )
    })
  )
}

//
// FETCH HISTORICAL TRANSCATION LOGS DATA
//

const getTradeHistoryLogsFromRelayERCdEX$ = (
  networkId,
  baseTokenAddress,
  quoteTokenAddress
) =>
  Observable.fromPromise(
    getTradeHistoryLogsFromRelayERCdEX(
      networkId,
      baseTokenAddress,
      quoteTokenAddress
    )
  )

export const getTradeHistoryLogsFromRelayERCdEXEpic = action$ => {
  return action$
    .ofType(TYPE_.FETCH_HISTORY_TRANSACTION_LOGS)
    .mergeMap(action => {
      return Observable.concat(
        // Observable.of({ type: UPDATE_ELEMENT_LOADING, payload: { marketBox: true }}),
        getTradeHistoryLogsFromRelayERCdEX$(
          action.payload.networkId,
          action.payload.baseTokenAddress,
          action.payload.quoteTokenAddress
        ).map(logs => {
          // const payload = historical.map(entry =>{
          //   const date = new Date(entry.date)
          //   entry.date = date
          //   return entry
          // })
          // console.log(payload)
          console.log(logs)
          return {
            type: TYPE_.UPDATE_HISTORY_TRANSACTION_LOGS,
            payload: logs
          }
        })
        // Observable.of({ type: UPDATE_ELEMENT_LOADING, payload: { marketBox: false }}),
      )
    })
}
