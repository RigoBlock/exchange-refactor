// Copyright 2017 Rigo Investment Sagl.
// This file is part of RigoBlock.

import { SupportedExchanges } from './const'
import { newMakerOrder } from './exchange'

describe('Create a new maker order', () => {
  it(`Create a sell order for Ethfinex success`, () => {
    const result = newMakerOrder(
      orderType,
      selectedTokensPair,
      selectedExchange,
      selectedFund,
      isTokenWrapper
    )
    expect(result).toEqual({
      method: 'GET',
      url: `${
        SupportedExchanges.ERCdEX.http[NETWORKS_ID[networkId]]
      }/reports/ticker?networkId=${networkId}`,
      qs: {},
      json: true
    })
  })
})
