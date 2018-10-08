// Copyright 2016-2017 Rigo Investment Sagl.

import { eventfulDragoReducer, eventfulVaultReducer } from './eventful_reducer'
import appReducer from './app_reducer'
import endpointsReducer from './endpoint_reducer'
import exchangeReducer from './exchange_reducer'
import notificationsReducer from './notification'
import transactionsReducer from './transactions'
import usersReducer from './users'
// import { webSocketReducer } from '../epics/exchange'
import { combineReducers } from 'redux'

class reducers {
  rootReducer = combineReducers({
    app: appReducer,
    exchange: exchangeReducer,
    transactions: transactionsReducer,
    user: usersReducer,
    endpoint: endpointsReducer,
    transactionsDrago: eventfulDragoReducer,
    transactionsVault: eventfulVaultReducer,
    // webSocketReducer: webSocketReducer,
    notifications: notificationsReducer
  })
}

let Reducers = new reducers()
export { Reducers }
