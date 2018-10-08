// Copyright 2017 Rigo Investment Sagl.
// This file is part of RigoBlock.

import * as abis from '../../contracts/abi'
import Registry from '../registry'

class RigoTokenFaucetParity {
  constructor(api) {
    if (!api) {
      throw new Error('API instance needs to be provided to Contract')
    }
    this._api = api
    this._abi = abis.rigotokenfaucet
    this._registry = new Registry(api)
    this._constunctorName = this.constructor.name
  }

  get instance() {
    if (typeof this._instance === 'undefined') {
      throw new Error('The contract needs to be initialized.')
    }
    return this._instance
  }

  init = address => {
    const api = this._api
    const abi = this._abi
    this._instance = api.newContract(abi, address).instance
    return this._instance
  }

  drip1Token = fromAddress => {
    if (!fromAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    const instance = this._instance
    const values = []
    const options = {
      from: fromAddress
    }
    return instance.drip1Token
      .estimateGas(options, values)
      .then(gasEstimate => {
        options.gas = gasEstimate.times(1.2).toFixed(0)
        console.log(`${options.gas}`)
        return instance.drip1Token.postTransaction(options, values)
      })
  }
}

export default RigoTokenFaucetParity
