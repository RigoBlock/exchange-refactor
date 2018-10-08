// Copyright 2016-2017 Rigo Investment Sagl.
// By the Power of Grayskull! I Have the Power!

import { Provider } from 'react-redux'
import { Reducers } from './_redux/reducers/root'
import { applyMiddleware, compose, createStore } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { persistReducer, persistStore } from 'redux-persist'
import { rootEpic } from './_redux/epics/root_epics'
import App from './App'
import React from 'react'
import ReactDOM from 'react-dom'
// import logger from 'redux-logger'

import registerServiceWorker from './registerServiceWorker'
// import thunkMiddleware from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension';
import * as ACTIONS from './_redux/actions/const'
import { PersistGate } from 'redux-persist/integration/react'
import { createFilter } from 'redux-persist-transform-filter'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import serializeError from 'serialize-error'
import storage from 'redux-persist/lib/storage'
import utils from './_utils/utils'

import './index.module.css'

function noop() {}

if (process.env.NODE_ENV !== 'development') {
  console.log = noop
  console.warn = noop
  console.error = noop
}

const relayActionsMiddleWare = store => next => action => {
  const state = store.getState()
  // console.log('relayActionsMiddleWare triggered:', action)
  // console.log(state.exchange.selectedRelay.name)
  // console.log(ACTIONS.CUSTOM_EXCHANGE_ACTIONS)
  if (ACTIONS.CUSTOM_EXCHANGE_ACTIONS.includes(action.type)) {
    console.log(
      `relayActionsMiddleWare  action: ${state.exchange.selectedRelay.name.toUpperCase()}_${
        action.type
      }`
    )
    action.type = `${state.exchange.selectedRelay.name.toUpperCase()}_${
      action.type
    }`
    console.log(action.type)
  }
  next(action)
}

const notificationsMiddleWare = store => next => action => {
  const state = store.getState()
  // console.log(action)
  if (action.type === ACTIONS.QUEUE_ACCOUNT_NOTIFICATION) {
    action.payload.map(notification => {
      utils.notificationAccount(
        state.notifications.engine,
        notification,
        'info'
      )
      return
    })
  }
  if (action.type === ACTIONS.QUEUE_ERROR_NOTIFICATION) {
    utils.notificationError(
      state.notifications.engine,
      serializeError(action.payload),
      'error'
    )
  }
  if (action.type === ACTIONS.QUEUE_WARNING_NOTIFICATION) {
    utils.notificationError(
      state.notifications.engine,
      serializeError(action.payload),
      'warning'
    )
  }
  next(action)
}

const epicMiddleware = createEpicMiddleware()

const middlewares = [
  // thunkMiddleware,
  epicMiddleware,
  relayActionsMiddleWare,
  notificationsMiddleWare
  // promiseMiddleware()
]

// if (process.env.NODE_ENV === `development`) {
//   middlewares.push(logger);
// }

// Redux Persist
const saveSubsetFilter = createFilter('endpoint', [
  'endpointInfo',
  'networkInfo'
])
//   const saveSubsetBlacklistFilter = createBlacklistFilter(
//     'endpoint',
//     ['accounts']
//   );

const persistConfig = {
  key: 'rigoblock',
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['endpoint', 'user'],
  transforms: [
    saveSubsetFilter
    // saveSubsetBlacklistFilter
  ]
}
const persistedReducer = persistReducer(persistConfig, Reducers.rootReducer)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const enhancer = composeEnhancers(applyMiddleware(...middlewares))

let store = createStore(persistedReducer, enhancer)
epicMiddleware.run(rootEpic)

let persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker()

// Hot Module Reload
if (module.hot) {
  module.hot.accept()
}
