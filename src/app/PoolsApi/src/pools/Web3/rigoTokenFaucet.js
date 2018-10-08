// Copyright 2017 Rigo Investment Sagl.
// This file is part of RigoBlock.

import * as abis from '../../contracts/abi'
import Registry from '../registry'

class RigoTokenFaucetWeb3 {
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
    if (!address) {
      throw new Error('address needs to be provided')
    }
    const api = this._api
    const abi = this._abi
    this._instance = new api.eth.Contract(abi)
    this._instance.options.address = address
    return this._instance
  }

  drip1Token = fromAddress => {
    const instance = this._instance
    let options = {
      from: fromAddress
    }
    console.log(instance)
    return instance.methods
      .drip1Token()
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        return instance.methods.drip1Token().send(options)
      })
  }
}

export default RigoTokenFaucetWeb3
