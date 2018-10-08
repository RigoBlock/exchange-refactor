// Copyright 2017 Rigo Investment Sagl.
// This file is part of RigoBlock.

import { SupportedExchanges } from './const'
import Exchange from './index'

describe('get tickers from exchange', () => {
  let networks = new Array()
  networks[1] = 'Mainnet'
  networks[42] = 'Kovan'
  networks.map((network, key) => {
    if (
      !SupportedExchanges['Ethfinex'].supportedNetworks.includes(key.toString())
    ) {
      // it(`Ethfinex not supported network ${network} success`, () => {
      //   const networkId = key
      //   expect(new Exchange('Ethfinex', networkId.toString(), 'http'))
      //   .toThrowError('Network not supported on this exchange: 42')
      // })
    } else {
      it(`Ethfinex REST get tickers for ${network} success`, () => {
        const networkId = key
        const exchange = new Exchange('Ethfinex', networkId.toString(), 'http')
        exchange.getTickers().then(results => {
          expect(results).toBeArray()
        })
      })
    }
  })
})
