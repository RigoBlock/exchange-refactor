// Copyright 2017 Rigo Investment Sagl.
// This file is part of RigoBlock.

import * as FORMAT from './format'
import * as http from './exchanges'
import * as ws from './exchangesWs'
import { ERCdEX, Ethfinex } from './const'
import { SupportedExchanges } from './const'
import rp from 'request-promise'

class Exchange {
  constructor(exchange, networkId, transport = 'http') {
    if (typeof SupportedExchanges[exchange] === 'undefined') {
      throw new Error('Exchange not supported: ' + exchange)
    }
    if (
      !SupportedExchanges[exchange].supportedNetworks.includes(
        networkId.toString()
      )
    ) {
      throw new Error('Network not supported on this exchange: ' + networkId)
    }
    this._exchange = exchange
    // this._network = networkId
    this._network = 3
    this._transport = transport
    this._exchangeProperties = SupportedExchanges[exchange]
    this._call = {
      http,
      ws
    }
  }

  returnResults = (
    query,
    formatFunction = input => {
      return input
    }
  ) => {
    switch (this._transport) {
      case 'ws':
        return query()
      case 'http':
        return rp(query())
          .then(results => {
            // console.log(results)
            // console.log(formatFunction)
            // console.log(formatFunction(results))
            // console.log('formatting')
            return formatFunction(results)
          })
          .catch(err => {
            console.log(err)
            throw new Error(err)
          })
      default:
        throw new Error('Transport unknown')
    }
  }

  getAggregatedOrders = (baseToken, quoteToken) => {
    console.log(`Fetching aggregated orders from ${this._exchange}`)
    if (!baseToken) {
      throw new Error('baseToken needs to be set')
    }
    if (!quoteToken) {
      throw new Error('quoteToken needs to be set')
    }
    return this.returnResults(() => {
      switch (this._exchange) {
        case ERCdEX:
          return this._call[this._transport].getAggregatedOrders[
            this._exchange
          ](this._network, baseToken, quoteToken)
        case Ethfinex:
          return this._call[this._transport].getAggregatedOrders[
            this._exchange
          ](this._network, baseToken, quoteToken)
        default:
          throw new Error('Relay unknown')
      }
    }, FORMAT.aggregatedOrders[this._exchange])
  }

  submbitOrder = signedOrder => {
    console.log(`Submitting order to ${this._exchange}`)
    if (!signedOrder) {
      throw new Error('signedOrder needs to be set')
    }
    return this.returnResults(
      () => {
        switch (this._exchange) {
          case ERCdEX:
            return this._call[this._transport].getOrders[this._exchange](
              signedOrder
            )
          // case Ethfinex:
          //   return this._call[this._transport].getOrders[this._exchange](signedOrder)
          default:
            throw new Error('Relay unknown')
        }
      }
      // FORMAT.orders[this._exchange]
    )
  }

  getAccountOrders = (account, baseToken, quoteToken) => {
    console.log(`${this._exchange}: Fetching account orders.`)
    if (!account) {
      throw new Error('account needs to be set')
    }
    if (!baseToken) {
      throw new Error('baseToken needs to be set')
    }
    if (!quoteToken) {
      throw new Error('quoteToken needs to be set')
    }
    return this.returnResults(() => {
      switch (this._exchange) {
        // case ERCdEX:
        //   return this._call[this._transport].getAccountOrders[this._exchange](this._network, baseToken, quoteToken)
        case Ethfinex:
          return this._call[this._transport].getAccountOrders[this._exchange](
            3,
            account
          )
        default:
          throw new Error('Relay unknown')
      }
    }, FORMAT.accountOrders[this._exchange])
  }

  getOrders = (baseToken, quoteToken) => {
    console.log(`${this._exchange}: Fetching orders.`)
    if (!baseToken) {
      throw new Error('baseToken needs to be set')
    }
    if (!quoteToken) {
      throw new Error('quoteToken needs to be set')
    }
    return this.returnResults(() => {
      switch (this._exchange) {
        case ERCdEX:
          return this._call[this._transport].getOrders[this._exchange](
            this._network,
            baseToken,
            quoteToken
          )
        case Ethfinex:
          return this._call[this._transport].getOrders[this._exchange](
            this._network,
            baseToken,
            quoteToken
          )
        default:
          throw new Error('Relay unknown')
      }
    }, FORMAT.orders[this._exchange])
  }

  getHistoricalPricesData = (baseToken, quoteToken, startDate) => {
    console.log(`Fetching historical prices from ${this._exchange}`)
    if (!baseToken) {
      throw new Error('baseToken needs to be set')
    }
    if (!quoteToken) {
      throw new Error('quoteToken needs to be set')
    }
    if (!startDate) {
      throw new Error('startDate needs to be set')
    }
    return this.returnResults(() => {
      switch (this._exchange) {
        case ERCdEX:
          return this._call[this._transport].getHistoricalPricesData[
            this._exchange
          ](this._network, baseToken, quoteToken, startDate)
        case Ethfinex:
          return this._call[this._transport].getHistoricalPricesData[
            this._exchange
          ](this._network, baseToken, quoteToken, startDate)
        default:
          throw new Error('Relay unknown')
      }
    }, FORMAT.historicalPricesData[this._exchange])
  }

  getTicker = (baseToken, quoteToken) => {
    if (!baseToken) {
      throw new Error('baseToken needs to be set')
    }
    if (!quoteToken) {
      throw new Error('quoteToken needs to be set')
    }
    return this.returnResults(() => {
      switch (this._exchange) {
        case ERCdEX:
          console.log(`Connecting to WS ${this._exchange}`)
          return this._call[this._transport].getTicker[this._exchange](
            this._network,
            baseToken,
            quoteToken
          )
        case Ethfinex:
          return this._call[this._transport].getTicker[this._exchange](
            this._network,
            baseToken,
            quoteToken
          )
        default:
          throw new Error('Relay unknown')
      }
    })
  }

  getTickers = (
    symbols = SupportedExchanges.Ethfinex.tickersTokenPairs.toString()
  ) => {
    console.log(`${this._exchange}: Fetching tokens prices`)
    // I have only added Ethfinex so far, because this function return every tokens price
    // and we use the data to calcuate the funds assets value.
    // Ethfinex will be our source of truth for the moment.
    // On the exchange, for now, we only need the price of the selected token.
    // Anyway, it's a mock.

    return this.returnResults(() => {
      return this._call[this._transport].getTickers[this._exchange](
        this._network,
        symbols
      )
    }, FORMAT.tickers[this._exchange])
  }
}

export default Exchange
