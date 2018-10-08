// Copyright 2017 Rigo Investment Sagl.
// This file is part of RigoBlock.

import * as abis from '../PoolsApi/src/contracts/abi'
import { BigNumber } from '@0xproject/utils'
import { INFURA, KOVAN, PROD, WS } from './const'
import { ZeroEx } from '0x.js'
import Web3 from 'web3'
// import ReconnectingWebSocket from 'reconnectingwebsocket'
import PoolApi from '../PoolsApi/src'
import rp from 'request-promise'

export const setAllowaceOnExchangeThroughDrago = (
  selectedFund,
  token,
  selectedExchange,
  amount
) => {
  // var provider = account.source === 'MetaMask' ? window.web3 : api
  const poolApi = new PoolApi(window.web3)
  poolApi.contract.drago.init(selectedFund.details.address)
  console.log('selectedFund.details.address ', selectedFund.details.address)
  console.log(
    'tokenTransferProxyAddress ',
    selectedExchange.tokenTransferProxyAddress
  )
  console.log('token.address ', token.address)
  console.log('selectedFund.managerAccount ', selectedFund.managerAccount)
  console.log('amount ', amount)
  return poolApi.contract.drago.setInfiniteAllowaceOnExchange(
    selectedFund.managerAccount,
    token.address,
    selectedFund.details.address,
    selectedExchange.tokenTransferProxyAddress,
    amount
  )
}

// export const getPricesFromRelayERCdEX = () => {
//   console.log('Fetching tokens prices from ERCdEX')
//   var options = {
//     method: 'GET',
//     url: `https://api.ercdex.com/api/reports/ticker`,
//     qs: {},
//     json: true // Automatically stringifies the body to JSON
//   };
//   console.log(options)
//   return rp(options)
// }

export const getOrdersFromRelayERCdEX = (
  networkId,
  maker,
  baseTokenAddress,
  quoteTokenAddress
) => {
  console.log('Fetching open orders from ERCdEX')
  if (!networkId) {
    throw new Error('networkId needs to be set')
  }
  if (!maker) {
    throw new Error('maker needs to be set')
  }
  if (!baseTokenAddress) {
    throw new Error('baseTokenAddress needs to be set')
  }
  if (!quoteTokenAddress) {
    throw new Error('quoteTokenAddress needs to be set')
  }
  let options = {
    method: 'GET',
    url: `https://api.ercdex.com/api/standard/${networkId}/v0/orders`,
    qs: {
      maker: maker,
      // tokenAddress: baseTokenAddress,
      makerTokenAddress: baseTokenAddress,
      takerTokenAddress: quoteTokenAddress
    },
    json: true // Automatically stringifies the body to JSON
  }
  console.log(options)
  return rp(options)
}

export const getTradeHistoryLogsFromRelayERCdEX = (
  networkId,
  baseTokenAddress,
  quoteTokenAddress
) => {
  console.log('Fetching transactions log from ERCdEX')
  if (!networkId) {
    throw new Error('networkId needs to be set')
  }
  if (!baseTokenAddress) {
    throw new Error('baseTokenAddress needs to be set')
  }
  if (!quoteTokenAddress) {
    throw new Error('quoteTokenAddress needs to be set')
  }
  let options = {
    method: 'GET',
    url: `https://api.ercdex.com/api/trade_history_logs`,
    qs: {
      networkId: networkId,
      token_address: baseTokenAddress,
      taker_token_address: quoteTokenAddress,
      maker_token_address: quoteTokenAddress
    },
    json: true // Automatically stringifies the body to JSON
  }
  console.log(options)
  return rp(options)
}

export const getHistoricalPricesDataFromERCdEX = (
  networkId,
  baseTokenAddress,
  quoteTokenAddress,
  startDate
) => {
  if (!networkId) {
    throw new Error('networkId needs to be set')
  }
  if (!baseTokenAddress) {
    throw new Error('baseTokenAddress needs to be set')
  }
  if (!quoteTokenAddress) {
    throw new Error('quoteTokenAddress needs to be set')
  }
  if (!startDate) {
    throw new Error('startDate needs to be set')
  }
  let options = {
    method: 'POST',
    url: `https://api.ercdex.com/api/reports/historical`,
    body: {
      networkId: networkId,
      baseTokenAddress: baseTokenAddress,
      quoteTokenAddress: quoteTokenAddress,
      startDate: startDate
    },
    json: true // Automatically stringifies the body to JSON
  }
  // console.log(options)
  return rp(options)
    .then(historical => {
      return historical
    })
    .catch(error => {
      console.log(error)
      return []
    })
}

// export const getOrderBookFromRelayERCdEX = (networkId, baseTokenAddress, quoteTokenAddress) => {
//   console.log('Fetching orderbook from ERCdEX')
//   if (!networkId) {
//     throw new Error('networkId needs to be set')
//   }
//   if (!baseTokenAddress) {
//     throw new Error('baseTokenAddress needs to be set')
//   }
//   if (!quoteTokenAddress) {
//     throw new Error('quoteTokenAddress needs to be set')
//   }
//   var options = {
//     method: 'GET',
//     url: `https://api.ercdex.com/api/standard/${networkId}/v0/orderbook`,
//     qs: {
//       baseTokenAddress: baseTokenAddress,
//       quoteTokenAddress: quoteTokenAddress
//     },
//     json: true // Automatically stringifies the body to JSON
//   };
//   console.log(options)
//   return rp(options)
//   .then(orders => {
//     console.log(orders)
//     const bidsOrders = formatOrders(orders.bids, 'bids')
//     const asksOrders = formatOrders(orders.asks, 'asks')
//     var spread = 0
//     if (bidsOrders.length !== 0 && asksOrders.length !== 0) {
//       spread = new BigNumber(asksOrders[asksOrders.length-1].orderPrice).minus(new BigNumber(bidsOrders[0].orderPrice)).toFixed(5)
//     } else {
//       spread = new BigNumber(0).toFixed(5)
//     }
//     return {
//       bids: bidsOrders,
//       asks: asksOrders,
//       spread
//     }
//   })
// }

// export const getAggregatedOrdersFromRelayERCdEX = (networkId, baseTokenAddress, quoteTokenAddress) => {
//   console.log('Fetching aggregated orders from ERCdEX')
//   if (!networkId) {
//     throw new Error('networkId needs to be set')
//   }
//   if (!baseTokenAddress) {
//     throw new Error('baseTokenAddress needs to be set')
//   }
//   if (!quoteTokenAddress) {
//     throw new Error('quoteTokenAddress needs to be set')
//   }
//   var options = {
//     method: 'GET',
//     uri: `https://api.ercdex.com/api/aggregated_orders`,
//     qs: {
//       networkId: networkId,
//       baseTokenAddress: baseTokenAddress,
//       quoteTokenAddress: quoteTokenAddress
//     },
//     json: true // Automatically stringifies the body to JSON
//   };
//   console.log(options)
//   return rp(options)
//   .then(orders => {
//     console.log(orders)
//     const bidsOrders = formatOrdersFromAggregate(orders.buys.priceLevels, 'bids')
//     console.log(bidsOrders)
//     const asksOrders = formatOrdersFromAggregate(orders.sells.priceLevels, 'asks')
//     console.log(asksOrders)
//     var spread = 0
//     console.log(asksOrders.length)
//     if (bidsOrders.length !== 0 && asksOrders.length !== 0) {
//       spread = new BigNumber(asksOrders[asksOrders.length-1].orderPrice).minus(new BigNumber(bidsOrders[0].orderPrice)).toFixed(5)
//     } else {
//       spread = new BigNumber(0).toFixed(5)
//     }
//     return {
//       bids: bidsOrders,
//       asks: asksOrders,
//       spread,
//       aggregated: true
//     }
//   })
// }

// export const formatOrdersFromAggregate = (orders) =>{
//   var orderPrice, orderAmount
//   let web3 = new Web3(Web3.currentProvider)
//   var formattedOrders = orders.map((order) => {
//     orderPrice = new BigNumber(order.price).toFixed(7)
//     orderAmount = new BigNumber(web3.utils.fromWei(order.volume)).toFixed(5)
//     var orderObject = {
//       orderAmount,
//       orderPrice,
//     }
//     return orderObject
//   })
//   return formattedOrders
// }

export const formatOrders = (orders, orderType) => {
  let orderPrice, orderAmount, remainingAmount
  let web3 = new Web3(Web3.currentProvider)
  let formattedOrders = orders.map(order => {
    switch (orderType) {
      case 'asks':
        orderPrice = new BigNumber(order.takerTokenAmount)
          .div(new BigNumber(order.makerTokenAmount))
          .toFixed(7)
        orderAmount = new BigNumber(
          web3.utils.fromWei(order.makerTokenAmount, 'ether')
        ).toFixed(5)
        remainingAmount = new BigNumber(
          web3.utils.fromWei(order.remainingTakerTokenAmount, 'ether')
        ).toFixed(5)
        break
      case 'bids':
        orderPrice = new BigNumber(1)
          .div(
            new BigNumber(order.takerTokenAmount).div(
              new BigNumber(order.makerTokenAmount)
            )
          )
          .toFixed(7)
        orderAmount = new BigNumber(
          web3.utils.fromWei(order.takerTokenAmount, 'ether')
        ).toFixed(5)
        remainingAmount = new BigNumber(
          web3.utils.fromWei(order.remainingTakerTokenAmount, 'ether')
        ).toFixed(5)
        break
    }
    let orderHash = ZeroEx.getOrderHashHex(order)
    let orderObject = {
      order,
      dateCreated: order.dateCreated,
      orderAmount,
      remainingAmount,
      orderType,
      orderPrice,
      orderHash
    }
    return orderObject
  })
  return formattedOrders
}

export const signOrder = async (order, selectedExchange, walletAddress) => {
  const DECIMALS = 18
  const baseTokenDecimals = order.selectedTokensPair.baseToken.decimals
  const quoteTokenDecimals = order.selectedTokensPair.quoteToken.decimals
  let makerTokenAmount, takerTokenAmount
  const zeroEx = new ZeroEx(window.web3.currentProvider, selectedExchange)

  switch (order.orderType) {
    case 'asks':
      makerTokenAmount = new BigNumber(order.orderFillAmount)
      takerTokenAmount = new BigNumber(makerTokenAmount).times(
        new BigNumber(order.orderPrice)
      )
      makerTokenAmount = ZeroEx.toBaseUnitAmount(
        makerTokenAmount,
        baseTokenDecimals
      )
      takerTokenAmount = ZeroEx.toBaseUnitAmount(
        takerTokenAmount,
        quoteTokenDecimals
      )
    case 'bids':
      makerTokenAmount = new BigNumber(order.orderFillAmount).times(
        new BigNumber(order.orderPrice)
      )
      takerTokenAmount = new BigNumber(order.orderFillAmount)
      makerTokenAmount = ZeroEx.toBaseUnitAmount(
        makerTokenAmount,
        quoteTokenDecimals
      )
      takerTokenAmount = ZeroEx.toBaseUnitAmount(
        takerTokenAmount,
        baseTokenDecimals
      )
      break
  }
  const tokensAmounts = {
    makerTokenAmount,
    takerTokenAmount
  }
  let orderToBeSigned = { ...order.details.order, ...tokensAmounts }
  // const fees = await getFees(orderToBeSigned, selectedExchange.networkId)
  // console.log(fees)
  // orderToBeSigned = {
  //   ...orderToBeSigned,
  //   ...fees
  // }
  // console.log(orderToBeSigned)
  const orderHash = ZeroEx.getOrderHashHex(orderToBeSigned)
  console.log(ZeroEx.isValidOrderHash(orderHash))
  const shouldAddPersonalMessagePrefix = true
  const signer = await zeroEx.getAvailableAddressesAsync()
  const ecSignature = await zeroEx.signOrderHashAsync(
    orderHash,
    signer[0],
    shouldAddPersonalMessagePrefix
  )
  console.log(`signer address ${walletAddress}`)
  console.log(ZeroEx.isValidSignature(orderHash, ecSignature, walletAddress))
  // Append signature to order
  const signedOrder = {
    ...orderToBeSigned,
    ecSignature
  }
  return signedOrder
}

export const submitOrderToRelayEFX = async efxOrder => {
  console.log(efxOrder)
  // const ZeroExConfig = {
  //   networkId: 42
  //   // exchangeContractAddress: this._network.id
  // }
  const relayerApiUrl = `https://test.ethfinex.com/trustless/v1/w/on`
  // const relayerClient = new HttpClient(relayerApiUrl);
  // const response = await relayerClient.submitOrderAsync(signedOrder);
  // console.log(response)
  let options = {
    method: 'POST',
    uri: relayerApiUrl,
    body: efxOrder,
    json: true // Automatically stringifies the body to JSON
  }

  return rp(options)
}

export const submitOrderToRelay = async signedOrder => {
  console.log(signedOrder)
  const ZeroExConfig = {
    networkId: 42
    // exchangeContractAddress: this._network.id
  }
  const relayerApiUrl = `https://api.ercdex.com/api/standard/${
    ZeroExConfig.networkId
  }/v0/order`
  // const relayerClient = new HttpClient(relayerApiUrl);
  // const response = await relayerClient.submitOrderAsync(signedOrder);
  // console.log(response)
  let options = {
    method: 'POST',
    uri: relayerApiUrl,
    body: signedOrder,
    json: true // Automatically stringifies the body to JSON
  }

  return rp(options)
}

export const softCancelOrderFromRelayERCdEX = async signedOrder => {
  console.log(signedOrder)
  const relayerApiUrl = `https://api.ercdex.com/api/orders/soft-cancel`
  // const relayerClient = new HttpClient(relayerApiUrl);
  // const response = await relayerClient.submitOrderAsync(signedOrder);
  // console.log(response)

  const signature = JSON.stringify(signedOrder.order.ecSignature)
  const oderHash = ZeroEx.getOrderHashHex(signedOrder.order)
  let options = {
    method: 'POST',
    uri: relayerApiUrl,
    body: {
      orderHash: oderHash,
      signature: signature
    },
    json: true // Automatically stringifies the body to JSON
  }

  return rp(options)
}

export const getFees = async (order, networkId) => {
  const relayerApiUrl = `https://api.ercdex.com/api/fees`

  let options = {
    method: 'POST',
    uri: relayerApiUrl,
    qs: {
      makerTokenAddress: order.makerTokenAddress,
      takerTokenAddress: order.takerTokenAddress,
      makerTokenAmount: new BigNumber(order.makerTokenAmount).toFixed(),
      takerTokenAmount: new BigNumber(order.takerTokenAmount).toFixed(),
      maker: order.maker,
      taker: order.taker,
      networkId: networkId
    },
    json: true // Automatically stringifies the body to JSON
  }
  console.log(options.qs)
  return rp(options)
}

export const getTokenAllowance = async (token, ownerAddress, ZeroExConfig) => {
  if (token.symbol === 'ETH') {
    return true
  }
  const zeroEx = new ZeroEx(window.web3.currentProvider, ZeroExConfig)
  return zeroEx.token.getProxyAllowanceAsync(token.address, ownerAddress)
}

export const setTokenAllowance = async (
  tokenAddress,
  ownerAddress,
  spenderAddress,
  ZeroExConfig
) => {
  const zeroEx = new ZeroEx(window.web3.currentProvider, ZeroExConfig)
  return zeroEx.token.setUnlimitedAllowanceAsync(
    tokenAddress,
    ownerAddress,
    spenderAddress
  )
}

export const getAvailableAccounts = async ZeroExConfig => {
  const zeroEx = new ZeroEx(window.web3.currentProvider, ZeroExConfig)
  return await zeroEx.getAvailableAddressesAsync()
}

export const getMarketTakerOrder = async (
  makerTokenAddress,
  takerTokenAddress,
  baseTokenAddress,
  quantity,
  networkId,
  takerAddress
) => {
  const relayerApiUrl = `https://api.ercdex.com/api/orders/best`

  let options = {
    method: 'GET',
    uri: relayerApiUrl,
    qs: {
      makerTokenAddress,
      takerTokenAddress,
      baseTokenAddress,
      quantity,
      networkId,
      takerAddress
    },
    json: true // Automatically stringifies the body to JSON
  }
  console.log(options.qs)
  return rp(options)
}

export const newMakerOrder = async (
  orderType,
  selectedTokensPair,
  selectedExchange,
  selectedFund,
  isTokenWrapper
) => {
  let makerTokenAddress, takerTokenAddress
  let web3 = new Web3(Web3.currentProvider)
  const defaultExpiry = ''
  if (isTokenWrapper) {
    makerTokenAddress =
      orderType === 'asks'
        ? selectedTokensPair.baseToken.wrappers[selectedExchange.name].address
        : selectedTokensPair.quoteToken.wrappers[selectedExchange.name].address
    takerTokenAddress =
      orderType === 'asks'
        ? selectedTokensPair.quoteToken.wrappers[selectedExchange.name].address
        : selectedTokensPair.baseToken.wrappers[selectedExchange.name].address
  } else {
    makerTokenAddress =
      orderType === 'asks'
        ? selectedTokensPair.baseToken.address
        : selectedTokensPair.quoteToken.address
    takerTokenAddress =
      orderType === 'asks'
        ? selectedTokensPair.quoteToken.address
        : selectedTokensPair.baseToken.address
  }

  const order = {
    maker: selectedFund.details.address.toLowerCase(),
    taker: selectedExchange.taker.toLowerCase(),
    feeRecipient: selectedExchange.feeRecipient.toLowerCase(),
    makerTokenAddress: makerTokenAddress.toLowerCase(),
    takerTokenAddress: takerTokenAddress.toLowerCase(),
    exchangeContractAddress: selectedExchange.exchangeContractAddress.toLowerCase(),
    salt: ZeroEx.generatePseudoRandomSalt(),
    makerFee: '0',
    takerFee: '0',
    makerTokenAmount: '0', // Base 18 decimals
    takerTokenAmount: '0', // Base 18 decimals
    expirationUnixTimestampSec: new BigNumber(
      Math.round(new Date().getTime() / 1000) + (defaultExpiry || 60) * 60
    ) // part after the plus can be replaced, first part is constant
  }
  console.log(order)
  return order
}

export const fillOrderToExchange = async (
  signedOrder,
  amount,
  ZeroExConfig
) => {
  // const zeroEx = this._zeroEx
  const DECIMALS = 18
  const shouldThrowOnInsufficientBalanceOrAllowance = true
  const zeroEx = new ZeroEx(window.web3.currentProvider, ZeroExConfig)
  const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(
    new BigNumber(amount),
    DECIMALS
  )
  const takerAddress = await zeroEx.getAvailableAddressesAsync()
  console.log(takerAddress)
  console.log(fillTakerTokenAmount)
  console.log(signedOrder)
  const txHash = await zeroEx.exchange.fillOrderAsync(
    signedOrder,
    fillTakerTokenAmount,
    shouldThrowOnInsufficientBalanceOrAllowance,
    takerAddress[0],
    {
      shouldValidate: false
    }
  )
  const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash)
  console.log('FillOrder transaction receipt: ', txReceipt)
}

export const fillOrderToExchangeViaProxy = async (
  selectedFund,
  signedOrder,
  amount,
  ZeroExConfig
) => {
  // const zeroEx = this._zeroEx
  const DECIMALS = 18

  const order = signedOrder

  console.log(JSON.stringify(signedOrder))

  const orderAddresses = [
    order.maker,
    order.taker,
    order.makerTokenAddress,
    order.takerTokenAddress,
    order.feeRecipient
  ]
  const orderValues = [
    order.makerTokenAmount,
    order.takerTokenAmount,
    order.makerFee,
    order.takerFee,
    order.expirationUnixTimestampSec,
    order.salt
  ]
  const v = order.ecSignature.v
  const r = order.ecSignature.r
  const s = order.ecSignature.s
  const shouldThrowOnInsufficientBalanceOrAllowance = true
  console.log(
    orderAddresses,
    orderValues,
    ZeroEx.toBaseUnitAmount(new BigNumber(amount), DECIMALS).toString(),
    shouldThrowOnInsufficientBalanceOrAllowance,
    v,
    r,
    s
  )

  let poolApi = null
  poolApi = new PoolApi(window.web3)
  poolApi.contract.drago.init(selectedFund.details.address)
  return poolApi.contract.drago.fillOrderOnZeroExExchange(
    selectedFund.managerAccount,
    orderAddresses,
    orderValues,
    ZeroEx.toBaseUnitAmount(new BigNumber(amount), DECIMALS).toString(),
    shouldThrowOnInsufficientBalanceOrAllowance,
    v,
    r,
    s,
    ZeroExConfig
  )
}

export const cancelOrderOnExchangeViaProxy = async (
  selectedFund,
  signedOrder,
  cancelTakerTokenAmount
) => {
  // const zeroEx = this._zeroEx
  const DECIMALS = 18

  const order = signedOrder

  console.log(JSON.stringify(signedOrder))

  const orderAddresses = [
    order.maker,
    order.taker,
    order.makerTokenAddress,
    order.takerTokenAddress,
    order.feeRecipient
  ]
  const orderValues = [
    order.makerTokenAmount,
    order.takerTokenAmount,
    order.makerFee,
    order.takerFee,
    order.expirationUnixTimestampSec,
    order.salt
  ]
  console.log(
    orderAddresses,
    orderValues,
    ZeroEx.toBaseUnitAmount(
      new BigNumber(cancelTakerTokenAmount),
      DECIMALS
    ).toString()
  )

  let poolApi = null
  poolApi = new PoolApi(window.web3)
  poolApi.contract.drago.init(selectedFund.details.address)
  return poolApi.contract.drago.cancelOrderOnZeroExExchange(
    selectedFund.managerAccount,
    orderAddresses,
    orderValues,
    ZeroEx.toBaseUnitAmount(
      new BigNumber(cancelTakerTokenAmount),
      DECIMALS
    ).toString(),
    signedOrder.exchangeContractAddress
  )
}

class Exchange {
  constructor(
    endpointInfo,
    networkInfo = { name: KOVAN },
    prod = PROD,
    ws = WS
  ) {
    if (!endpointInfo) {
      throw new Error(
        'endpointInfo connection data needs to be provided to Endpoint'
      )
    }
    if (!networkInfo) {
      throw new Error('network name needs to be provided to Endpoint')
    }
    this._timeout = 1000
    this._endpoint = endpointInfo
    this._network = networkInfo
    this._exchangeAddress = this._network.zeroExExchangeContractAddress
    this._prod = prod
    this._exchangeAbi = abis.zeroExExchange
    this._tradeTokensPair = null
    this._baseTokenAddress = null
    this._quoteTokenAddress = null
    this._supportedRelays = {
      radarrelay: 'wss://ws.kovan.radarrelay.com/0x/v0/ws',
      ercdex: 'https://api.ercdex.com/api/standard'
    }
    // Infura does not support WebSocket on Kovan network yet. Disabling.
    this._onWs =
      this._network.name === KOVAN && this._endpoint.name === INFURA
        ? false
        : ws
    // Setting production or development endpoints
    if (prod) {
      this._https = endpointInfo.https[this._network.name].prod
      this._wss = endpointInfo.wss[this._network.name].prod
    } else {
      this._https = endpointInfo.https[this._network.name].dev
      this._wss = endpointInfo.wss[this._network.name].dev
    }

    const ZeroExConfig = {
      networkId: this._network.id
      // exchangeContractAddress: this._network.id
    }
    this._zeroEx = new ZeroEx(window.web3.currentProvider, ZeroExConfig)
  }

  get timeout() {
    return this._timeout
  }

  set timeout(timeout) {
    this._timeout = timeout
  }

  get tradeTokensPair() {
    return this._tradeTokensPair
  }

  set tradeTokensPair(tradeTokensPair) {
    this._baseTokenAddress = tradeTokensPair.baseToken.address
    this._quoteTokenAddress = tradeTokensPair.quoteToken.address
    this._tradeTokensPair = tradeTokensPair
  }

  init = () => {
    // console.log(Aqueduct.Initialize())
    if (this._onWs) {
      try {
        let api
        console.log('Network: ', this._network.name)
        console.log('Connecting to: ', this._wss)
        api = new Web3(this._wss)
        api._rb = {}
        api._rb.network = this._network
        this.api = api
        return new api.eth.Contract(this._exchangeAbi, this._exchangeAddress)
      } catch (error) {
        console.log('Connection error: ', error)
        return error
      }
    } else {
      try {
        let api
        console.log('Network: ', this._network.name)
        console.log('Connecting to: ', this._https)
        api = new Web3(this._https)
        api._rb = {}
        api._rb.network = this._network
        this.api = api
        return new api.eth.Contract(this._exchangeAbi, this._exchangeAddress)
      } catch (error) {
        console.log('Connection error: ', error)
        return error
      }
    }
  }

  // getOrderBookFromRelay = (relay = 'wss://ws.kovan.radarrelay.com/0x/v0/ws') => {
  //   if (!this._baseTokenAddress) {
  //     throw new Error('baseTokenAddress needs to be set')
  //   }
  //   if (!this._quoteTokenAddress) {
  //     throw new Error('quoteTokenAddress needs to be set')
  //   }
  //   const subscribeMsg = `{
  //     "type": "subscribe",
  //     "channel": "orderbook",
  //     "requestId": 1,
  //     "payload": {
  //         "baseTokenAddress": "${this._baseTokenAddress}",
  //         "quoteTokenAddress": "${this._quoteTokenAddress}",
  //         "snapshot": true,
  //         "limit": 100
  //     }
  //   }`
  //   // console.log(subscribeMsg)
  //   var ws = new ReconnectingWebSocket(relay);
  //   ws.onopen = function () {
  //     console.log(`Connected to ${relay}`);
  //     ws.send(subscribeMsg);
  //   };
  //   ws.onerror = (event) => {
  //     console.log(event)
  //     console.log('Connection error')
  //   }
  //   ws.onclose = async (event) => {
  //     console.log(event)
  //     console.log('Connection closed')
  //   }
  //   return ws
  // }

  // getOrderBookFromRelayERCdEX = (relay = 'https://api.ercdex.com/api/standard') => {
  //   console.log('Fetching from ERCdEX')
  //   if (!this._baseTokenAddress) {
  //     throw new Error('baseTokenAddress needs to be set')
  //   }
  //   if (!this._quoteTokenAddress) {
  //     throw new Error('quoteTokenAddress needs to be set')
  //   }
  //   var options = {
  //     method: 'GET',
  //     uri: `${relay}/${this._network.id}/v0/orderbook`,
  //     qs: {
  //       baseTokenAddress: this._baseTokenAddress, // -> uri + '?access_token=xxxxx%20xxxxx'
  //       quoteTokenAddress: this._quoteTokenAddress
  //     },
  //     json: true // Automatically stringifies the body to JSON
  //   };
  //   console.log(options)
  //   return rp(options)
  //     .then((ordersERCdEX) => {
  //       var ws = new ReconnectingWebSocket('wss://api.ercdex.com');
  //       ws.onopen = () => {
  //         console.log(`Connected to wss://api.ercdex.com`);
  //         console.log((`sub:pair-order-change/${this._baseTokenAddress}/${this._quoteTokenAddress}`))
  //         console.log((`sub:pair-order-change/${this._quoteTokenAddress}/${this._baseTokenAddress}`))
  //         ws.send(`sub:pair-order-change/${this._baseTokenAddress}/${this._quoteTokenAddress}`);
  //         ws.send(`sub:pair-order-change/${this._quoteTokenAddress}/${this._baseTokenAddress}`);
  //         // ws.send(`sub:pair-taker-event/${this._quoteTokenAddress}/${this._baseTokenAddress}`);
  //         // ws.send(`sub:account-order-change/0xec4ee1bcf8107480815b08b530e0ead75b9f804f`);
  //         // ws.send(`sub:ticker`);
  //         // ws.send(subscribeMsg);
  //       };
  //       ws.onerror = (event) => {
  //         console.log(event)
  //         console.log('Connection error')
  //       }
  //       ws.onclose = async (event) => {
  //         console.log(event)
  //         console.log('Connection closed')
  //       }
  //       ordersERCdEX.ws = ws
  //       return ordersERCdEX
  //       // POST succeeded...
  //     })
  //     .catch(function (err) {
  //       console.log(err)
  //       return err
  //       // POST failed...
  //     });
  // }

  formatOrders = (orders, orderType) => {
    let orderPrice, orderAmount
    let formattedOrders = orders.map(order => {
      switch (orderType) {
        case 'asks':
          orderPrice = new BigNumber(order.takerTokenAmount)
            .div(new BigNumber(order.makerTokenAmount))
            .toFixed(7)
          orderAmount = new BigNumber(
            this.api.utils.fromWei(order.makerTokenAmount, 'ether')
          ).toFixed(5)
          break
        case 'bids':
          orderPrice = new BigNumber(1)
            .div(
              new BigNumber(order.takerTokenAmount).div(
                new BigNumber(order.makerTokenAmount)
              )
            )
            .toFixed(7)
          orderAmount = new BigNumber(
            this.api.utils.fromWei(order.takerTokenAmount, 'ether')
          ).toFixed(5)
          break
      }
      let orderHash = ZeroEx.getOrderHashHex(order)
      let orderObject = {
        order,
        orderAmount,
        orderType,
        orderPrice,
        orderHash
      }
      return orderObject
    })
    return formattedOrders
  }

  // fillOrderToExchange = async (signedOrder, amount) =>{
  //   // const zeroEx = this._zeroEx
  //   const DECIMALS = 18;
  //   const shouldThrowOnInsufficientBalanceOrAllowance = true;
  //   const ZeroExConfig = {
  //     networkId: this._network.id,
  //     exchangeContractAddress: '0xf307de6528fa16473d8f6509b7b1d8851320dba5',
  //     tokenTransferProxyContractAddress: '0xcc040edf6e508c4372a62b1a902c69dcc52ceb1d'
  //   }
  //   const zeroEx = new ZeroEx(window.web3.currentProvider, ZeroExConfig);
  //   const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(amount), DECIMALS)
  //   const takerAddress = await zeroEx.getAvailableAddressesAsync()
  //   console.log(takerAddress)
  //   console.log(fillTakerTokenAmount)

  //   const txHash = await zeroEx.exchange.fillOrderAsync(
  //     signedOrder,
  //     fillTakerTokenAmount,
  //     shouldThrowOnInsufficientBalanceOrAllowance,
  //     takerAddress[0],
  //     {
  //       shouldValidate: false
  //     }
  //   );
  //   const txReceipt = await this._zeroEx.awaitTransactionMinedAsync(txHash);
  //   console.log('FillOrder transaction receipt: ', txReceipt);
  // }

  // signOrder = async (order) => {
  //   const zeroEx = this._zeroEx
  //   const DECIMALS = 18;
  //   var makerTokenAmount, takerTokenAmount
  //   switch (order.orderType) {
  //     case "asks":
  //       makerTokenAmount = new BigNumber(order.orderFillAmount)
  //       takerTokenAmount = new BigNumber(makerTokenAmount).times(new BigNumber(order.orderPrice))
  //       break;
  //     case "bids":
  //       makerTokenAmount = new BigNumber(order.orderFillAmount).times(new BigNumber(order.orderPrice))
  //       takerTokenAmount = new BigNumber(order.orderFillAmount)
  //       break;
  //   }
  //   const tokensAmounts = {
  //     makerTokenAmount: ZeroEx.toBaseUnitAmount(makerTokenAmount, DECIMALS), // Base 18 decimals
  //     takerTokenAmount: ZeroEx.toBaseUnitAmount(takerTokenAmount, DECIMALS), // Base 18 decimals
  //   };
  //   var orderToBeSigned = { ...order.details.order, ...tokensAmounts }
  //   const fees = await this.getFees(orderToBeSigned)
  //   console.log(fees)
  //   const orderToBeSignedWithFees = {
  //     ...orderToBeSigned,
  //     ...fees
  //   }
  //   console.log(orderToBeSignedWithFees)
  //   const orderHash = ZeroEx.getOrderHashHex(orderToBeSignedWithFees);
  //   console.log(ZeroEx.isValidOrderHash(orderHash))
  //   const shouldAddPersonalMessagePrefix = true;
  //   const signer = await zeroEx.getAvailableAddressesAsync();
  //   const ecSignature = await zeroEx.signOrderHashAsync(orderHash, signer[0], shouldAddPersonalMessagePrefix);
  //   console.log(ZeroEx.isValidSignature(
  //     orderHash,
  //     ecSignature,
  //     orderToBeSigned.maker
  //   )
  // )

  //   // Append signature to order
  //   const signedOrder = {
  //     ...orderToBeSignedWithFees,
  //     ecSignature,
  //   };
  //   return signedOrder
  // }

  // getFees = async (feesRequest) => {

  //   const relayerApiUrl = 'https://api.kovan.radarrelay.com/0x/v0/'
  //   const relayerClient = new HttpClient(relayerApiUrl);
  //   const relayerFees = await relayerClient.getFeesAsync(feesRequest)
  //   return relayerFees
  //   // {
  //   //   exchangeContractAddress: string,
  //   //   expirationUnixTimestampSec: BigNumber,
  //   //   maker: string,
  //   //   makerTokenAddress: string,
  //   //   makerTokenAmount: BigNumber,
  //   //   salt: BigNumber,
  //   //   taker: string,
  //   //   takerTokenAddress: string,
  //   //   takerTokenAmount: BigNumber,
  //   // }
  // }

  submitOrderToRelay = async signedOrder => {
    console.log(signedOrder)
    const relayerApiUrl = 'https://api.kovan.radarrelay.com/0x/v0/order'
    // const relayerClient = new HttpClient(relayerApiUrl);
    // const response = await relayerClient.submitOrderAsync(signedOrder);
    // console.log(response)
    let options = {
      method: 'POST',
      uri: relayerApiUrl,
      body: signedOrder,
      json: true // Automatically stringifies the body to JSON
    }

    rp(options)
      .then(function(parsedBody) {
        console.log(parsedBody)
        // POST succeeded...
      })
      .catch(function(err) {
        console.log(err)
        // POST failed...
      })
  }

  // newMakerOrder = async (orderType) => {
  //   const zeroEx = this._zeroEx
  //   const DECIMALS = 18;
  //   const EXCHANGE_ADDRESS = zeroEx.exchange.getContractAddress();
  //   const accounts = await zeroEx.getAvailableAddressesAsync();
  //   const walletAddress = accounts[0]
  //   const makerTokenAddress = (orderType === 'asks') ? this._baseTokenAddress : this._quoteTokenAddress
  //   const takerTokenAddress = (orderType === 'asks') ? this._quoteTokenAddress : this._baseTokenAddress

  //   const order = {
  //     // maker: "0x57072759Ba54479669CAdF1A25528a472Af95cEF".toLowerCase(),
  //     maker: walletAddress,
  //     dragoAddress: "0x57072759Ba54479669CAdF1A25528a472Af95cEF".toLowerCase(),
  //     taker: ZeroEx.NULL_ADDRESS,
  //     feeRecipient: ZeroEx.NULL_ADDRESS,
  //     makerTokenAddress: makerTokenAddress,
  //     takerTokenAddress: takerTokenAddress,
  //     exchangeContractAddress: '0xf307de6528fa16473d8f6509b7b1d8851320dba5',
  //     // exchangeContractAddress: EXCHANGE_ADDRESS,
  //     salt: ZeroEx.generatePseudoRandomSalt(),
  //     makerFee: '0',
  //     takerFee: '0',
  //     makerTokenAmount: '0', // Base 18 decimals
  //     takerTokenAmount: '0', // Base 18 decimals
  //     expirationUnixTimestampSec: new BigNumber(Date.now() + 2592000), // Valid for up to 1 month
  //   };
  //   return order
  // }

  updateOrderToOrderBook = (order, orders, action) => {
    console.log(order, orders, action)
    let orderPrice, orderAmount, orderType
    this._baseTokenAddress === order.makerTokenAddress
      ? (orderType = 'asks')
      : (orderType = 'bids')
    switch (orderType) {
      case 'asks':
        orderPrice = new BigNumber(order.takerTokenAmount)
          .div(new BigNumber(order.makerTokenAmount))
          .toFixed(7)
        orderAmount = new BigNumber(
          this.api.utils.fromWei(order.makerTokenAmount, 'ether')
        ).toFixed(5)
        break
      case 'bids':
        orderPrice = new BigNumber(1)
          .div(
            new BigNumber(order.takerTokenAmount).div(
              new BigNumber(order.makerTokenAmount)
            )
          )
          .toFixed(7)
        orderAmount = new BigNumber(
          this.api.utils.fromWei(order.takerTokenAmount, 'ether')
        ).toFixed(5)
        break
    }
    // var orderHash = ZeroEx.getOrderHashHex(order)
    let orderObject = {
      order,
      orderAmount,
      orderType,
      orderPrice,
      orderHash: order.orderHash
    }
    let newOrders = { ...orders }

    switch (action) {
      case 'add':
        console.log(action)
        switch (orderType) {
          case 'asks':
            newOrders.asksOrders.push(orderObject)
            break
          case 'bids':
            newOrders.bidsOrders.push(orderObject)
            break
        }
        break
      case 'remove':
        console.log(action)
        switch (orderType) {
          case 'asks':
            newOrders.asksOrders = orders.asksOrders.filter(oldOrder => {
              return oldOrder.orderHash !== order.orderHash
            })
            break
          case 'bids':
            newOrders.bidsOrders = orders.bidsOrders.filter(oldOrder => {
              return oldOrder.orderHash !== order.orderHash
            })
            break
        }
        break
      default:
        newOrders = { ...orders }
    }
    console.log(newOrders)
    return newOrders
  }
}

export default Exchange
