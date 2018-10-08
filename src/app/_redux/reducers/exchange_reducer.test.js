import * as TYPE_ from '../actions/const'
import deepFreeze from 'deep-freeze'
import exchangeReducer from './exchange_reducer'

describe('exchange reducer', () => {
  it(`${TYPE_.UPDATE_CURRENT_TOKEN_PRICE} init success`, () => {
    const action = {
      type: TYPE_.UPDATE_CURRENT_TOKEN_PRICE,
      payload: {
        current: {
          price: '0.0023582047733391154'
        }
      }
    }
    const state = {
      selectedTokensPair: {
        ticker: {
          current: {
            price: '0'
          },
          previous: {
            price: '0'
          },
          variation: 0
        }
      }
    }
    deepFreeze(state)
    deepFreeze(action)
    const results = exchangeReducer(state, action)
    expect(results).toEqual({
      selectedTokensPair: {
        ticker: {
          current: {
            price: '0.0023582047733391154'
          },
          previous: {
            price: '0'
          },
          variation: 0
        }
      }
    })
  })
  it(`${TYPE_.UPDATE_CURRENT_TOKEN_PRICE} update success`, () => {
    const action = {
      type: TYPE_.UPDATE_CURRENT_TOKEN_PRICE,
      payload: {
        current: {
          price: '2'
        }
      }
    }
    const state = {
      selectedTokensPair: {
        ticker: {
          current: {
            price: '1.5'
          },
          previous: {
            price: '3'
          },
          variation: 0
        }
      }
    }
    deepFreeze(state)
    deepFreeze(action)
    const results = exchangeReducer(state, action)
    expect(results).toEqual({
      selectedTokensPair: {
        ticker: {
          current: {
            price: '2'
          },
          previous: {
            price: '1.5'
          },
          variation: '33.3333'
        }
      }
    })
  })

  it(`${TYPE_.UPDATE_ACCOUNT_SIGNATURE} update success`, () => {
    // Full object update
    let action = {
      type: TYPE_.UPDATE_ACCOUNT_SIGNATURE,
      payload: {
        signature: '123',
        nonce: '123',
        valid: true
      }
    }
    const state = {
      accountSignature: {
        signature: '',
        nonce: '',
        valid: false
      }
    }
    deepFreeze(state)
    deepFreeze(action)
    const resultsFull = exchangeReducer(state, action)
    expect(resultsFull).toEqual({
      accountSignature: {
        signature: '123',
        nonce: '123',
        valid: true
      }
    })

    // Partial object update
    action = {
      type: TYPE_.UPDATE_ACCOUNT_SIGNATURE,
      payload: {
        signature: '123456',
        valid: true
      }
    }
    const resultsPartial = exchangeReducer(state, action)
    expect(resultsPartial).toEqual({
      accountSignature: {
        signature: '123456',
        nonce: '',
        valid: true
      }
    })
  })
})
