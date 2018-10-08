// Copyright 2017 Rigo Investment Sagl.
// This file is part of RigoBlock.

import * as abis from '../../contracts/abi'
import Registry from '../registry'

class DragoWeb3 {
  constructor(api) {
    if (!api) {
      throw new Error('API instance needs to be provided to Contract')
    }
    this._api = api
    this._abi = abis.drago
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
      throw new Error('Contract address needs to be provided')
    }
    const api = this._api
    const abi = this._abi
    this._instance = new api.eth.Contract(abi)
    this._instance.options.address = address
  }

  getData = () => {
    const instance = this._instance
    return instance.getData.call({})
  }

  /**
   *  Requests are proxied through the fund smart contract. The exchange has to be approved.
   *
   * @param {*} managerAccountAddress     The address of the owner of the fund
   * @param {*} dragoAddress              The address of the fund.
   * @param {*} exchangeContractAddress   The address of the exchange (Ethfinex for example)
   * @param {*} tokenAddress              The address of the token to be un-locked.
   * @param {*} tokenWrapper              The address of the token wrapper.
   * @param {*} toBeWrapped               The amount in base units to be unwrapped. A baseUnit is defined as the smallest denomination of a token.
   * @param {*} time                      Lock time (1 for 1h)
   * @param {*} isOldERC20                True for non standard ERC20 tokens su as USDT.
   * @returns                             A promise resolving the smart contract method called.
   */
  operateOnExchangeEFXLock = async (
    managerAccountAddress,
    dragoAddress,
    exchangeContractAddress,
    tokenAddress,
    tokenWrapper,
    toBeWrapped,
    time,
    isOldERC20
  ) => {
    if (!managerAccountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!dragoAddress) {
      throw new Error('dragoAddress needs to be provided')
    }
    if (!exchangeContractAddress) {
      throw new Error('exchangeContractAddress needs to be provided')
    }
    // if (!tokenAddress) {
    //   throw new Error('tokenAddress needs to be provided')
    // }
    if (!tokenWrapper) {
      throw new Error('tokenWrapper needs to be provided')
    }
    if (!toBeWrapped) {
      throw new Error('toBeWrapped needs to be provided')
    }
    if (!time) {
      throw new Error('time need to be provided')
    }
    if (typeof isOldERC20 === 'undefined') {
      throw new Error('isOldERC20 need to be provided')
    }
    if (tokenAddress === '0x0') {
      tokenAddress = '0x0000000000000000000000000000000000000000'
    }
    console.log(`managerAccountAddress ${managerAccountAddress}`)
    console.log(`dragoAddress ${dragoAddress}`)
    console.log(`exchangeContractAddres ${exchangeContractAddress}`)
    console.log(`tokenAddress ${tokenAddress}`)
    console.log(`tokenWrapper ${tokenWrapper}`)
    console.log(`toBeWrapped ${toBeWrapped}`)
    console.log(`time ${time}`)
    console.log(`isOldERC20 ${isOldERC20}`)

    const instance = this._instance
    const api = this._api
    let options = {
      from: managerAccountAddress
    }
    const contractMethod = {
      name: 'wrapToEfx',
      type: 'function',
      inputs: [
        {
          type: 'address',
          name: 'token'
        },
        {
          type: 'address',
          name: 'wrapper'
        },
        {
          type: 'uint256',
          name: 'value'
        },
        {
          type: 'uint256',
          name: 'forTime'
        },
        {
          type: 'bool',
          name: 'erc20Old'
        }
      ]
    }
    const encodedABI = await api.eth.abi.encodeFunctionCall(contractMethod, [
      tokenAddress,
      tokenWrapper,
      toBeWrapped.toString(),
      time,
      isOldERC20
    ])
    console.log(encodedABI)
    return instance.methods
      .operateOnExchange(exchangeContractAddress, encodedABI)
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        return instance.methods
          .operateOnExchange(exchangeContractAddress, encodedABI)
          .send(options)
      })
  }

  /**
   * Requests are proxied through the fund smart contract. The exchange has to be approved.
   *
   * @param {*} managerAccountAddress   The address of the owner of the fund
   * @param {*} dragoAddress            The address of the fund.
   * @param {*} exchangeContractAddress The address of the exchange (Ethfinex for example)
   * @param {*} tokenAddress            The address of the token to be un-locked.
   * @param {*} tokenWrapper            The address of the token wrapper.
   * @param {*} toBeUnwrapped           The amount in base units to be unwrapped. A baseUnit is defined as the smallest denomination of a token.
   * @returns                           A promise resolving the smart contract method called.
   */
  operateOnExchangeEFXUnlock = async (
    managerAccountAddress,
    dragoAddress,
    exchangeContractAddress,
    tokenAddress,
    tokenWrapper,
    toBeUnwrapped
  ) => {
    if (!managerAccountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!dragoAddress) {
      throw new Error('dragoAddress needs to be provided')
    }
    if (!exchangeContractAddress) {
      throw new Error('exchangeContractAddress needs to be provided')
    }
    if (!tokenWrapper) {
      throw new Error('tokenWrapper needs to be provided')
    }
    if (!toBeUnwrapped) {
      throw new Error('toBeUnWrapped needs to be provided')
    }

    console.log(`managerAccountAddress ${managerAccountAddress}`)
    console.log(`dragoAddress ${dragoAddress}`)
    console.log(`exchangeContractAddres ${exchangeContractAddress}`)
    console.log(`tokenAddress ${tokenAddress}`)
    console.log(`tokenWrapper ${tokenWrapper}`)
    console.log(`toBeUnWrapped ${toBeUnwrapped}`)
    const instance = this._instance
    const api = this._api
    let options = {
      from: managerAccountAddress
    }

    if (tokenAddress === '0x0') {
      tokenAddress = '0x0000000000000000000000000000000000000000'
    }
    const contractMethod = {
      name: 'unwrap',
      type: 'function',
      inputs: [
        {
          type: 'address',
          name: 'token'
        },
        {
          type: 'address',
          name: 'wrapper'
        },
        {
          type: 'uint256',
          name: 'value'
        },
        {
          type: 'uint8',
          name: 'v'
        },
        {
          type: 'bytes32',
          name: 'r'
        },
        {
          type: 'bytes32',
          name: 's'
        },
        {
          type: 'uint256',
          name: 'signatureValidUntilBlock'
        }
      ]
    }
    const v = 1
    const r =
      '0xfa39c1a29cab1aa241b62c2fd067a6602a9893c2afe09aaea371609e11cbd92d' // mock bytes32
    const s =
      '0xfa39c1a29cab1aa241b62c2fd067a6602a9893c2afe09aaea371609e11cbd92d' // mock bytes32
    const validUntil = 1
    const encodedABI = await api.eth.abi.encodeFunctionCall(contractMethod, [
      tokenAddress,
      tokenWrapper,
      toBeUnwrapped.toString(),
      v,
      r,
      s,
      validUntil
    ])
    console.log(encodedABI)
    return instance.methods
      .operateOnExchange(exchangeContractAddress, encodedABI)
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        return instance.methods
          .operateOnExchange(exchangeContractAddress, encodedABI)
          .send(options)
      })
  }

  setInfiniteAllowaceOnExchange = (
    accountAddress,
    tokenAddress,
    ownerAddress,
    spenderAddress,
    amount
  ) => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!tokenAddress) {
      throw new Error('tokenAddress needs to be provided')
    }
    if (!ownerAddress) {
      throw new Error('ownerAddress needs to be provided')
    }
    if (!spenderAddress) {
      throw new Error('spenderAddress needs to be provided')
    }
    if (!amount) {
      throw new Error('amount needs to be provided')
    }
    const instance = this._instance
    const api = this._api
    let options = {
      from: accountAddress
    }
    const contractMethod = abis.erc20.find(method => method.name === 'approve')
    const encodedABI = api.eth.abi.encodeFunctionCall(contractMethod, [
      spenderAddress,
      amount
    ])
    console.log(encodedABI)
    console.log('tokenAddress ', tokenAddress)
    console.log('ownerAddress ', ownerAddress)
    console.log('spenderAddress ', spenderAddress)
    return instance.methods
      .operateOnExchangeDirectly(tokenAddress, encodedABI)
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        return instance.methods
          .operateOnExchangeDirectly(tokenAddress, encodedABI)
          .send(options)
      })
  }

  fillOrderOnZeroExExchange = (
    managerAccount,
    orderAddresses,
    orderValues,
    amount,
    shouldThrowOnInsufficientBalanceOrAllowance,
    v,
    r,
    s,
    ZeroExConfig
  ) => {
    if (!managerAccount) {
      throw new Error('managerAccount needs to be provided')
    }
    if (!orderAddresses) {
      throw new Error('orderAddresses needs to be provided')
    }
    if (!orderValues) {
      throw new Error('orderValues needs to be provided')
    }
    if (!amount) {
      throw new Error('amount needs to be provided')
    }
    if (!shouldThrowOnInsufficientBalanceOrAllowance) {
      throw new Error(
        'shouldThrowOnInsufficientBalanceOrAllowance needs to be provided'
      )
    }
    if (!v || !r || !s) {
      throw new Error('v r s need to be provided')
    }
    if (!ZeroExConfig) {
      throw new Error('ZeroExConfig need to be provided')
    }
    const instance = this._instance
    const api = this._api
    let options = {
      from: managerAccount
    }
    const contractMethod = abis.zeroExExchange.find(
      method => method.name === 'fillOrder'
    )
    const encodedABI = api.eth.abi.encodeFunctionCall(contractMethod, [
      orderAddresses,
      orderValues,
      amount,
      shouldThrowOnInsufficientBalanceOrAllowance,
      v,
      r,
      s
    ])

    // const encodedABI = '0xbc61394a00000000000000000000000040584e290e5c56114c8bcf72fa3d403d1166b3d700000000000000000000000000000000000000000000000000000000000000000000000000000000000000001dad4783cf3fe3085c1426157ab175a6119a04ba000000000000000000000000d0a1e359811322d97991e03f863a0c30c2cf029c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001638384d81aace3db94ad2d6f00aaa892a70c34850dcb894fde0f5eb1c50fd50b4320c16df400000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001c969d3a50aab834aee8f7ee57a885746502933168c63071c6c270848ad502032b466238fa9e7bc9f9a5dd3e0ca738512b0ba16ecf770f12369d65a4cd293a6fac'

    console.log(encodedABI)
    console.log('orderAddresses ', orderAddresses)
    console.log('orderValues ', orderValues)
    console.log('amount ', amount)
    console.log(
      'shouldThrowOnInsufficientBalanceOrAllowance ',
      shouldThrowOnInsufficientBalanceOrAllowance
    )
    console.log('v ', v)
    console.log('r ', r)
    console.log('s ', s)
    console.log(
      'ZeroExConfig.exchangeContractAddress    ',
      ZeroExConfig.exchangeContractAddress
    )
    return instance.methods
      .operateOnExchangeDirectly(
        ZeroExConfig.exchangeContractAddress,
        encodedABI
      )
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        return instance.methods
          .operateOnExchangeDirectly(
            ZeroExConfig.exchangeContractAddress,
            encodedABI
          )
          .send(options)
      })
  }

  cancelOrderOnZeroExExchange = (
    managerAccount,
    orderAddresses,
    orderValues,
    cancelTakerTokenAmount,
    exchangeContractAddress
  ) => {
    if (!managerAccount) {
      throw new Error('managerAccount needs to be provided')
    }
    if (!orderAddresses) {
      throw new Error('orderAddresses needs to be provided')
    }
    if (!orderValues) {
      throw new Error('orderValues needs to be provided')
    }
    if (!cancelTakerTokenAmount) {
      throw new Error('cancelTakerTokenAmount needs to be provided')
    }
    if (!exchangeContractAddress) {
      throw new Error('exchangeContractAddress need to be provided')
    }
    const instance = this._instance
    const api = this._api
    let options = {
      from: managerAccount
    }
    const contractMethod = abis.zeroExExchange.find(
      method => method.name === 'cancelOrder'
    )
    const encodedABI = api.eth.abi.encodeFunctionCall(contractMethod, [
      orderAddresses,
      orderValues,
      cancelTakerTokenAmount
    ])

    // const encodedABI = '0xbc61394a00000000000000000000000040584e290e5c56114c8bcf72fa3d403d1166b3d700000000000000000000000000000000000000000000000000000000000000000000000000000000000000001dad4783cf3fe3085c1426157ab175a6119a04ba000000000000000000000000d0a1e359811322d97991e03f863a0c30c2cf029c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001638384d81aace3db94ad2d6f00aaa892a70c34850dcb894fde0f5eb1c50fd50b4320c16df400000000000000000000000000000000000000000000000000000000000003e80000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000001c969d3a50aab834aee8f7ee57a885746502933168c63071c6c270848ad502032b466238fa9e7bc9f9a5dd3e0ca738512b0ba16ecf770f12369d65a4cd293a6fac'

    console.log(encodedABI)
    console.log('orderAddresses ', orderAddresses)
    console.log('orderValues ', orderValues)
    console.log('cancelTakerTokenAmount ', cancelTakerTokenAmount)
    console.log('exchangeContractAddress ', exchangeContractAddress)
    return instance.methods
      .operateOnExchangeDirectly(exchangeContractAddress, encodedABI)
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        return instance.methods
          .operateOnExchangeDirectly(exchangeContractAddress, encodedABI)
          .send(options)
      })
  }

  setInfiniteAllowace = (accountAddress, spenderAddress, tokenAddress) => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!tokenAddress) {
      throw new Error('tokenAddress needs to be provided')
    }
    if (!spenderAddress) {
      throw new Error('spenderAddress needs to be provided')
    }
    const instance = this._instance
    let options = {
      from: accountAddress
    }
    console.log(spenderAddress)
    console.log(tokenAddress)
    return instance.methods
      .setInfiniteAllowance(spenderAddress, tokenAddress)
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        return instance.methods
          .setInfiniteAllowance(spenderAddress, tokenAddress)
          .send(options)
      })
  }

  buyDrago = (accountAddress, amount) => {
    const instance = this._instance
    let options = {
      from: accountAddress,
      value: amount
    }
    return instance.methods
      .buyDrago()
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        return instance.methods.buyDrago().send(options)
      })
  }

  sellDrago = (accountAddress, amount) => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!amount) {
      throw new Error('amount needs to be provided')
    }
    const instance = this._instance
    let options = {
      from: accountAddress
    }
    console.log(amount)
    return instance.methods
      .sellDrago(amount)
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        return instance.methods.sellDrago(amount).send(options)
      })
  }

  setPrices = (accountAddress, buyPrice, sellPrice) => {
    if (!accountAddress) {
      throw new Error('accountAddress needs to be provided')
    }
    if (!buyPrice) {
      throw new Error('buyPrice needs to be provided')
    }
    if (!sellPrice) {
      throw new Error('sellPrice needs to be provided')
    }
    const instance = this._instance
    let options = {
      from: accountAddress
    }
    instance.options.from = accountAddress
    const api = this._api
    const buyPriceWei = api.utils.toWei(buyPrice, 'ether')
    const sellPriceWei = api.utils.toWei(sellPrice, 'ether')
    return instance.methods
      .setPrices(
        sellPriceWei,
        buyPriceWei,
        1,
        api.utils.fromAscii('random'),
        api.utils.fromAscii('random')
      )
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        // console.log(gasEstimate.toFormat())
        options.gas = gasEstimate
        console.log(instance)
        return instance.methods
          .setPrices(
            sellPriceWei,
            buyPriceWei,
            1,
            api.utils.fromAscii('random'),
            api.utils.fromAscii('random')
          )
          .send(options)
      })
    // .catch((error) => {
    //   console.error('error', error)
    // })
  }

  totalSupply = () => {
    const instance = this._instance
    return instance.methods.totalSupply.call({})
  }

  depositToExchange = (exchangeAddress, fromAddress, amount) => {
    if (!fromAddress) {
      throw new Error('toAddress needs to be provided')
    }
    if (!amount) {
      throw new Error('amount needs to be provided')
    }
    if (!exchangeAddress) {
      throw new Error('exchangeAddress needs to be provided')
    }
    const instance = this._instance
    const options = {
      from: fromAddress
    }
    console.log(exchangeAddress)
    return instance.methods
      .depositToExchange(exchangeAddress, amount)
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        return instance.methods
          .depositToExchange(exchangeAddress, amount)
          .send(options)
      })
  }

  withdrawFromExchange = (exchangeAddress, fromAddress, amount) => {
    if (!fromAddress) {
      throw new Error('toAddress needs to be provided')
    }
    if (!amount) {
      throw new Error('amount needs to be provided')
    }
    if (!exchangeAddress) {
      throw new Error('exchangeAddress needs to be provided')
    }
    const instance = this._instance
    const options = {
      from: fromAddress
    }
    console.log(exchangeAddress)
    return instance.methods
      .withdrawFromExchange(exchangeAddress, amount)
      .estimateGas(options)
      .then(gasEstimate => {
        console.log(gasEstimate)
        options.gas = gasEstimate
      })
      .then(() => {
        return instance.methods
          .withdrawFromExchange(exchangeAddress, amount)
          .send(options)
      })
  }
}

export default DragoWeb3
