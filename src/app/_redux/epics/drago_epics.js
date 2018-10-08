// Copyright 2016-2017 Rigo Investment Sagl.

import 'rxjs/add/observable/from'
import 'rxjs/add/observable/timer'
import 'rxjs/add/operator/bufferTime'
import 'rxjs/add/operator/concat'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/exhaustMap'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/observable/timer'
import { Actions } from '../actions/'
import { Observable } from 'rxjs/Observable'
import PoolApi from '../../PoolsApi/src'

import {
  GET_TOKEN_BALANCES_DRAGO,
  QUEUE_ERROR_NOTIFICATION,
  UPDATE_ELEMENT_LOADING
} from '../actions/const'

import { BigNumber } from '../../../node_modules/bignumber.js/bignumber'
import { ERC20_TOKENS } from '../../_utils/tokens'

const getTokensBalances$ = (dragoDetails, api) => {
  //
  // Initializing Drago API
  //
  const poolApi = new PoolApi(api)
  const dragoAddress = dragoDetails[0][0]
  try {
    poolApi.contract.drago.init(dragoAddress)
  } catch (err) {
    throw this._error
  }

  const getTokensBalances = async () => {
    let allowedTokens = ERC20_TOKENS[api._rb.network.name]
    let dragoAssets = {}
    for (let token in allowedTokens) {
      let balances = {
        token: new BigNumber(0),
        wrappers: {},
        total: new BigNumber(0)
      }
      if (allowedTokens[token].address !== '0x0') {
        let total = new BigNumber(0)
        try {
          balances.token = await poolApi.contract.drago.getTokenBalance(
            allowedTokens[token].address
          )
          // console.log(`${token} - ${allowedTokens[token].address} -> ${balances.token}`)
          total = total.plus(balances.token)
          if (typeof allowedTokens[token].wrappers !== 'undefined') {
            for (let wrapper in allowedTokens[token].wrappers) {
              balances.wrappers[
                wrapper
              ] = await poolApi.contract.drago.getTokenBalance(wrapper.address)
              total = total.plus(balances.wrappers[wrapper])
            }
          }
          // Only add tokens with balance > 0
          if (!total.eq(0)) {
            balances.total = total
            dragoAssets[token] = allowedTokens[token]
            dragoAssets[token].balances = balances
          }
        } catch (err) {
          console.log(err)
          throw err
        }
      } else {
      }
    }
    // test = Object.assign(dragoAssets)
    // test.sort(function(a, b) {
    //   let symbolA = a.symbol.toUpperCase()
    //   let symbolB = b.symbol.toUpperCase()
    //   if (symbolA < symbolB) {
    //     return -1
    //   }
    //   if (symbolA > symbolB) {
    //     return 1
    //   }
    //   // names must be equal
    //   return 0
    // })
    // dragoAssets.sort(function(a, b) {
    //   if (a.symbol < b.symbol) return -1
    //   if (a.symbol > b.symbol) return 1
    //   return 0
    // })
    return dragoAssets
  }
  return Observable.fromPromise(
    getTokensBalances().catch(err => {
      throw err
    })
  )
}

export const getTokensBalancesEpic = action$ => {
  return action$.ofType(GET_TOKEN_BALANCES_DRAGO).mergeMap(action => {
    return getTokensBalances$(action.payload.dragoDetails, action.payload.api)
      .map(dragoAssets => {
        const ordered = {}
        Object.keys(dragoAssets)
          .sort()
          .forEach(function(key) {
            ordered[key] = dragoAssets[key]
          })
        return ordered
      })
      .mergeMap(dragoAssets =>
        Observable.concat(
          // Observable.of(
          //   Actions.drago.getAssetsPriceDataAction(
          //     dragoAssets,
          //     42,
          //     ERC20_TOKENS['kovan'].WETH.address
          //   )
          // ),
          // Observable.of({
          //   type: UPDATE_ELEMENT_LOADING,
          //   payload: { marketBox: true }
          // }),
          Observable.of(
            Actions.drago.updateSelectedDragoAction({
              assets: Object.values(dragoAssets)
            })
          ),
          Observable.of(
            Actions.tokens.priceTickersStart(
              action.payload.relay,
              action.payload.api._rb.network.id
            )
          ),
          Observable.of(
            Actions.exchange.getPortfolioChartDataStart(
              action.payload.relay,
              action.payload.api._rb.network.id
            )
          )
          // Observable.of({
          //   type: UPDATE_ELEMENT_LOADING,
          //   payload: { marketBox: false }
          // })
        )
      )
      .catch(error => {
        console.log(error)
        return Observable.of({
          type: QUEUE_ERROR_NOTIFICATION,
          payload: 'Error fetching fund assets balances.'
        })
      })
  })
}
