// Copyright 2017 Rigo Investment Sagl.
// This file is part of RigoBlock.

import * as abis from '../../contracts/abi'
import { DRAGOEVENTFUL } from '../../utils/const'
import { toHex } from '../../utils'
import Registry from '../registry'

class DragoEventfulParity {
  constructor(api) {
    if (!api) {
      throw new Error('API instance needs to be provided to Contract')
    }
    this._api = api
    this._abi = abis.dragoeventful
    this._registry = new Registry(api)
    this._constunctorName = this.constructor.name
    this._contractName = DRAGOEVENTFUL
  }

  get instance() {
    if (typeof this._instance === 'undefined') {
      throw new Error('The contract needs to be initialized.')
    }
    return this._instance
  }

  get contract() {
    if (typeof this._contract === 'undefined') {
      throw new Error('The contract needs to be initialized.')
    }
    return this._contract
  }

  get hexSignature() {
    return this._hexSignature
  }

  get abi() {
    return this._abi
  }

  init = () => {
    const contractAbi = this._abi
    const contractName = this._contractName
    return this._registry.instance(contractAbi, contractName).then(contract => {
      this._instance = contract.instance
      this._contract = contract
      const hexSignature = this._contract._events.reduce((events, event) => {
        events[event._name] = toHex(event._signature)
        return events
      }, {})
      this._hexSignature = hexSignature
      return this._instance
    })
  }

  getAllLogs = (topics = { topics: [null, null, null, null] }) => {
    const contract = this._contract
    return contract.getAllLogs(topics)
  }
}

export default DragoEventfulParity
