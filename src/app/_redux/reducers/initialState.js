// Copyright 2016-2017 Rigo Investment Sagl.

import {
  DEFAULT_ENDPOINT,
  DEFAULT_NETWORK_NAME,
  ENDPOINTS,
  ERC20_TOKENS,
  ERCdEX,
  EXCHANGES,
  Ethfinex,
  MSG_NETWORK_STATUS_OK,
  NETWORKS,
  NETWORK_OK,
  RELAYS,
  TRADE_TOKENS_PAIRS
} from '../../_utils/const'

import BigNumber from 'bignumber.js'

const NETWORK_NAME = DEFAULT_NETWORK_NAME
// const NETWORK_NAME = 'ropsten'
// const BASE_TOKEN = ERC20_TOKENS[NETWORK_NAME].ETH
// const QUOTE_TOKEN = ERC20_TOKENS[NETWORK_NAME].USDT

const BASE_TOKEN = ERC20_TOKENS[NETWORK_NAME].ZRX
const QUOTE_TOKEN = ERC20_TOKENS[NETWORK_NAME].WETH

// const ERCdEX = 'ERCdEX'
// const Ethfinex = 'Ethfinex'

const fakeTicker = () => {
  let arr = Array()
  let now = new Date().getTime()
  let yesterday = new Date().setDate(new Date().getDate() - 1)
  let _15minEpoch = 15 * 60 * 1000
  for (let i = now; i > yesterday; i -= _15minEpoch) {
    arr.push({
      date: new Date(i),
      low: 70.2,
      high: 100,
      open: 70,
      close: 80,
      volume: 1000,
      epoch: i
    })
  }
  return arr.reverse()
}

const initialState = {
  app: {
    isConnected: false,
    isSyncing: false,
    syncStatus: {},
    appLoading: true,
    retryTimeInterval: 0,
    connectinoRetries: 0
  },
  notifications: {
    engine: ''
  },
  exchange: {
    loading: {
      liquidity: true,
      orderSummary: true,
      orderBox: true,
      marketBox: true
    },
    // chartData: [
    //   {
    //     date: new Date(),
    //     low: 1,
    //     high: 2,
    //     open: 1,
    //     close: 2,
    //     volume: 2,
    //     epoch: 0
    //   },
    //   {
    //     date: new Date(),
    //     low: 2,
    //     high: 3,
    //     open: 2,
    //     close: 2,
    //     volume: 3,
    //     epoch: 0
    //   }
    // ],
    chartData: [],
    selectedFund: {
      details: {},
      liquidity: {
        loading: true,
        ETH: new BigNumber(0),
        WETH: new BigNumber(0),
        ZRX: new BigNumber(0),
        baseToken: {
          balance: new BigNumber(0),
          balanceWrapper: new BigNumber(0)
        },
        quoteToken: {
          balance: new BigNumber(0),
          balanceWrapper: new BigNumber(0)
        }
      },
      managerAccount: ''
    },
    accountSignature: {
      signature: '',
      nonce: '',
      valid: false
    },
    walletAddress: '',
    walletSelectedAddress: '',
    selectedExchange: EXCHANGES.ERCdEX[NETWORK_NAME],
    selectedRelay: RELAYS[ERCdEX],
    availableRelays: {},
    // selectedExchange: EXCHANGES.rigoBlock[DEFAULT_NETWORK_NAME],
    selectedTokensPair: {
      baseToken: BASE_TOKEN,
      baseTokenLockedAmount: new BigNumber(0),
      baseTokenAvailableAmount: new BigNumber(0),
      quoteToken: QUOTE_TOKEN,
      quoteTokenLockedAmount: new BigNumber(0),
      quoteTokenAvailableAmount: new BigNumber(0),
      baseTokenAllowance: false,
      quoteTokenAllowance: false,
      baseTokenLockWrapExpire: '0',
      quoteTokenLockWrapExpire: '0',
      ticker: {
        current: {
          price: '0'
        },
        previous: {
          price: '0'
        },
        variation: 0
      }
    },
    availableTradeTokensPairs: TRADE_TOKENS_PAIRS,
    fundOrders: {
      open: [],
      cancelled: [],
      executed: []
    },
    selectedOrder: {
      details: {},
      orderAmountError: true,
      orderPriceError: true,
      orderFillAmount: '0',
      orderMaxAmount: '0',
      orderPrice: '0',
      orderType: 'asks',
      takerOrder: false,
      selectedTokensPair: {
        baseToken: BASE_TOKEN,
        quoteToken: QUOTE_TOKEN
      }
    },
    orderBookAggregated: RELAYS[ERCdEX].onlyAggregateOrderbook,
    orderBook: {
      asks: [],
      bids: [],
      spread: '0'
    },
    relay: {
      url: 'https://api.ercdex.com/api/standard',
      networkId: '42'
    },
    prices: {}
  },
  transactions: {
    queue: new Map(),
    pending: 0
  },
  transactionsDrago: {
    holder: {
      balances: [],
      logs: []
    },
    manager: {
      list: [],
      logs: []
    },
    selectedDrago: {
      details: {},
      transactions: [],
      assets: [],
      assetsCharts: {
        GRG: {
          data: fakeTicker()
        }
      }
    }
  },
  transactionsVault: {
    holder: {
      balances: [],
      logs: []
    },
    manager: {
      list: [],
      logs: []
    },
    selectedVault: {
      details: {},
      transactions: []
    }
  },
  endpoint: {
    accounts: [],
    accountsBalanceError: false,
    ethBalance: new BigNumber(0),
    grgBalance: new BigNumber(0),
    endpointInfo: ENDPOINTS[DEFAULT_ENDPOINT],
    networkInfo: NETWORKS[DEFAULT_NETWORK_NAME],
    loading: true,
    networkError: NETWORK_OK,
    networkStatus: MSG_NETWORK_STATUS_OK,
    prevBlockNumber: '0',
    prevNonce: '0',
    warnMsg: '',
    isMetaMaskNetworkCorrect: false,
    isMetaMaskLocked: true,
    lastMetaMaskUpdateTime: 0,
    openWalletSetup: false
  },
  user: {
    isManager: false
  }
}

export default initialState
