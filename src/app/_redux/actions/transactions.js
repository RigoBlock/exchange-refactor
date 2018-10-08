// Copyright 2016-2017 Rigo Investment Sarl.

import { ADD_TRANSACTION } from './const'

const transactions = {
  addTransactionToQueueAction: (transactionId, transactionDetails) => {
    return {
      type: ADD_TRANSACTION,
      payload: { transactionId, transactionDetails }
    }
  }
}

export default transactions
