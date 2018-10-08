// Copyright 2016-2017 Rigo Investment Sarl.

import {
  TOKEN_PRICE_TICKERS_FETCH_START,
  TOKEN_PRICE_TICKERS_FETCH_STOP
} from './const'

const tokens = {
  priceTickersStart: (relay, networkId) => {
    const payload = {
      relay,
      networkId
    }
    return {
      type: TOKEN_PRICE_TICKERS_FETCH_START,
      payload
    }
  },
  priceTickersStop: () => {
    return {
      type: TOKEN_PRICE_TICKERS_FETCH_STOP
    }
  }
}

export default tokens
