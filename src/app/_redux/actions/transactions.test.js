import { ADD_TRANSACTION } from './const'
import transactions from './transactions'

describe('transactions actions creator', () => {
  it('ADD_TRANSACTION success', () => {
    const transactionId = '1234'
    const transactionDetails = {}
    const results = transactions.addTransactionToQueueAction(
      transactionId,
      transactionDetails
    )
    expect(results).toEqual({
      type: ADD_TRANSACTION,
      payload: { transactionId, transactionDetails }
    })
  })
})
