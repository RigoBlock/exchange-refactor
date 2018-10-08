// https://github.com/redux-observable/redux-observable/issues/477#issuecomment-393516995

import { Observable } from 'rxjs/Observable'
import { isConnectedToNode$, updateAccounts } from './endpoint_epics'

import {
  MSG_NETWORK_STATUS_ERROR,
  MSG_NETWORK_STATUS_OK,
  NETWORK_OK,
  NETWORK_WARNING
} from '../../_utils/const'
import PoolsApi from '../../PoolsApi/src/index.js'

jest.mock('../../PoolsApi/src/index.js')

const accounts = new Map([
  [
    '0x01',
    {
      balance: {
        eth: 30000000000000000000,
        grg: 50000000000000000000
      }
    }
  ],
  [
    '0x02',
    {
      balance: {
        eth: 30000000000000000000,
        grg: 50000000000000000000
      }
    }
  ]
])
let initialState_1
let initialState_2

// Mock Api
let api

// Mock PoolApi
const rigotoken = {
  init: jest.fn(),
  balanceOf: jest.fn(address => {
    return accounts.get(address).balance.grg
  })
}
PoolsApi.mockImplementation(() => {
  return {
    contract: {
      rigotoken
    }
  }
})

beforeEach(function() {
  api = {
    isConnected: false,
    plus: 0,
    output: {
      syncing: false
    },
    eth: {
      getBalance: jest.fn(address => {
        return accounts.get(address).balance.eth - api.plus
      }),
      syncing: jest.fn(async () => {
        return await api.output.syncing
      })
    }
  }

  initialState_1 = {
    endpoint: {
      accounts: [
        {
          name: 'MetaMask',
          address: '0x01',
          ethBalance: '10.000',
          grgBalance: '20.000',
          ethBalanceWei: '10000000000000000000',
          grgBalanceWei: '20000000000000000000'
        },
        {
          name: 'Parity',
          address: '0x02',
          ethBalance: '10.000',
          grgBalance: '20.000',
          ethBalanceWei: '10000000000000000000',
          grgBalanceWei: '20000000000000000000'
        }
      ],
      prevBlockNumber: 10
    }
  }

  initialState_2 = {
    endpoint: {
      accounts: [],
      prevBlockNumber: 10
    }
  }
})

const createMockStore = state => {
  return {
    state,
    getState: function() {
      return this.state
    }
  }
}

describe('monitor connection to node', () => {
  // it('1 -> node is NOT connected success', async () => {
  //   api.isConnected = false
  //   api.output.syncing = false
  //   let ob = isConnectedToNode$(api)
  //   // console.log(ob)
  //   ob.subscribe(data => {
  //     console.log(data)
  //     expect(data).toEqual(
  //       {
  //         isConnected: true,
  //         isSyncing: true,
  //         syncStatus: {},
  //       })
  //   })
  // })
  // it('2 -> node is connected success', () => {
  //   api.isConnected = true
  //   api.output.syncing = false
  //   isConnectedToNode$(api).subscribe(data => {
  //     expect(data).toEqual(
  //       {
  //         isConnected: true,
  //         isSyncing: false,
  //         syncStatus: {},
  //       })
  //   })
  // }, 5000)
  it('3 -> node is connected and syncing success', done => {
    api.isConnected = true
    api.output.syncing = { syncing: 'yes' }
    let ob = isConnectedToNode$(api)
    ob.subscribe(data => {
      expect(data).toEqual({
        isConnected: true,
        isSyncing: true,
        syncStatus: { syncing: 'yes' }
      })
      done()
    })
  })
  // it('4 -> node is connected and NOT syncing success', async () => {
  //   api.isConnected = true
  //   api.output.syncing = false
  //   isConnectedToNode$(api).subscribe(data => {
  //     console.log(data)
  //     expect(data).toEqual(
  //       {
  //         isConnected: true,
  //         isSyncing: false,
  //         syncStatus: {},
  //       })
  //   })
  // })
  // it('5 -> node timeout success', async () => {
  //   api.isConnected = true
  //   api.output.syncing = false
  //   isConnectedToNode$(api).subscribe(data => {
  //     expect(data).toThrow()
  //   })
  // })
})

// describe("update account balance", () => {
//   it('1 -> Detect prevBlockNumber > currentBlockNumber success', async () => {
//     const newBlockNumber = 5
//     const results = await updateAccounts(api, newBlockNumber, createMockStore(initialState_1))
//     expect(results)
//       .toEqual([{
//         prevBlockNumber: initialState_1.endpoint.prevBlockNumber
//       },
//       Array(0)
//       ])
//   })
//   it('2 -> Detect accounts !==0 success', async () => {
//     const newBlockNumber = 15
//     const results = await updateAccounts(api, newBlockNumber, createMockStore(initialState_2))
//     expect(results)
//       .toEqual([{
//         ...initialState_2.endpoint,
//         loading: false,
//         prevBlockNumber: newBlockNumber.toString()
//       },
//       Array(0)
//       ])
//   })
//   it('3 -> Detect increased balance difference', async () => {
//     const newBlockNumber = 15
//     const results = await updateAccounts(api, newBlockNumber, createMockStore(initialState_1))
//     expect(results)
//       .toEqual([{
//         ...initialState_1.endpoint,
//         loading: false,
//         networkError: NETWORK_OK,
//         networkStatus: MSG_NETWORK_STATUS_OK,
//         accountsBalanceError: false,
//         loading: false,
//         prevBlockNumber: newBlockNumber.toString()
//       },
//       Array(0)
//       ])
//   })
//   it('4 -> Detect no balance difference', async () => {
//     const newBlockNumber = 15
//     api.plus = 20000000000000000000
//     const results = await updateAccounts(api, newBlockNumber, createMockStore(initialState_1))
//     expect(results)
//       .toEqual([{
//         loading: false,
//         networkError: NETWORK_OK,
//         networkStatus: MSG_NETWORK_STATUS_OK,
//         accountsBalanceError: false,
//         loading: false,
//         prevBlockNumber: newBlockNumber.toString(),
//         ethBalance: "20000000000000000000",
//         grgBalance: "40000000000000000000",
//         accounts: [
//           {
//             name: 'MetaMask',
//             address: '0x01',
//             ethBalance : "10.000",
//             grgBalance: "20.000",
//             ethBalanceWei : "10000000000000000000",
//             grgBalanceWei: "20000000000000000000"
//           },
//           {
//             name: 'Parity',
//             address: '0x02',
//             ethBalance : "10.000",
//             grgBalance: "20.000",
//             ethBalanceWei : "10000000000000000000",
//             grgBalanceWei: "20000000000000000000"
//           },
//         ],
//       },
//       Array(0)
//       ])
//   })
// })
