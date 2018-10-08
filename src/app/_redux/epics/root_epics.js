// Copyright 2016-2017 Rigo Investment Sagl.

import { combineEpics } from 'redux-observable'
import {
  // relayWebSocketEpic,
  getOrderBookFromRelayEpic,
  getTradeHistoryLogsFromRelayERCdEXEpic,
  getLiquidityAndTokenBalancesEpic,
  updateFundLiquidityEpic,
  updateLiquidityAndTokenBalancesEpic
  // getAssetsPricesDataFromERCdEXEpic
} from './exchange_epics'

import * as Endpoint from './endpoint_epics'
import * as Tokens from './token_epics'
import { ERCdEX, Ethfinex } from './exchanges'
import { getTokensBalancesEpic } from './drago_epics'

const ERCdEX_Epics = [
  ERCdEX.getCandlesSingleDataEpic,
  ERCdEX.initRelayWebSocketEpic,
  ERCdEX.orderBookEpic,
  ERCdEX.getAccountOrdersEpic
]

const Tokens_Epics = [
  Tokens.setTokenAllowanceEpic,
  Tokens.getPricesEpic,
  Tokens.getCandlesGroupDataEpic
]

const Ethfinex_Epics = [
  Ethfinex.getCandlesSingleDataEpic,
  Ethfinex.initRelayWebSocketEpic,
  Ethfinex.orderBookEpic,
  Ethfinex.getAccountOrdersEpic
]

const Endpoint_Epics = [
  Endpoint.checkMetaMaskIsUnlockedEpic,
  Endpoint.getAccountsTransactionsEpic,
  Endpoint.monitorAccountsEpic,
  Endpoint.isConnectedToNodeEpic,
  Endpoint.attacheInterfaceEpic,
  Endpoint.delayShowAppEpic
]

export const rootEpic = combineEpics(
  // relayWebSocketEpic,
  ...Endpoint_Epics,
  ...ERCdEX_Epics,
  ...Ethfinex_Epics,
  ...Tokens_Epics,
  getTokensBalancesEpic,
  getOrderBookFromRelayEpic,
  getLiquidityAndTokenBalancesEpic,
  updateLiquidityAndTokenBalancesEpic,
  updateFundLiquidityEpic,
  getTradeHistoryLogsFromRelayERCdEXEpic
  // getAssetsPricesDataFromERCdEXEpic
)
