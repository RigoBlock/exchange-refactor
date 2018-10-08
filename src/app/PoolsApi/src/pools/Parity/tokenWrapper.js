// Copyright 2017 Rigo Investment Sagl.
// This file is part of RigoBlock.

import * as abis from '../../contracts/abi'
import Registry from '../registry'

class TokenWrapperParity {
  constructor(api) {
    if (!api) {
      throw new Error('API instance needs to be provided to Contract')
    }
    this._api = api
    this._abi = abis.tokenWrapper
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

  balanceOf = accountAddress => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    const instance = this._instance
    return instance.balanceOf.call({}, [accountAddress])
  }

  depositLock = accountAddress => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    const instance = this._instance
    return instance.depositLock.call({}, [accountAddress])
  }
}

export default TokenWrapperParity
