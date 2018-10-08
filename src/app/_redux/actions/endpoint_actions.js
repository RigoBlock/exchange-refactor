// Copyright 2016-2017 Rigo Investment Sarl.

import * as TYPE_ from './const'

const endpoint = {
  attachInterface: (web3, api, endpoint) => {
    return {
      type: TYPE_.ATTACH_INTERFACE,
      payload: {
        web3,
        api,
        endpoint
      }
    }
  },
  checkMetaMaskIsUnlocked: (api, web3) => {
    return {
      type: TYPE_.CHECK_METAMASK_IS_UNLOCKED,
      payload: {
        api,
        web3
      }
    }
  },
  checkIsConnectedToNode: api => {
    return {
      type: TYPE_.CHECK_APP_IS_CONNECTED,
      payload: {
        api
      }
    }
  },
  getAccountsTransactions: (api, dragoAddress, accounts, options) => {
    return {
      type: TYPE_.GET_ACCOUNTS_TRANSACTIONS,
      payload: {
        api,
        dragoAddress,
        accounts,
        options
      }
    }
  },
  monitorAccountsStart: (web3, api) => {
    return {
      type: TYPE_.MONITOR_ACCOUNTS_START,
      payload: {
        web3,
        api
      }
    }
  },
  monitorAccountsStop: (web3, api) => {
    return {
      type: TYPE_.MONITOR_ACCOUNTS_STOP,
      payload: {
        web3,
        api
      }
    }
  },
  updateInterface: endpoint => {
    return {
      type: TYPE_.UPDATE_INTERFACE,
      payload: endpoint
    }
  }
}

export default endpoint
