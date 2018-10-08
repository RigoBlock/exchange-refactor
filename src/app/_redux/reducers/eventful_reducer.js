// Copyright 2016-2017 Rigo Investment Sagl.

import {
  UPDATE_SELECTED_DRAGO_DETAILS,
  UPDATE_SELECTED_DRAGO_DETAILS_CHART_ASSETS_MARKET_ADD_DATAPOINT,
  UPDATE_SELECTED_DRAGO_DETAILS_CHART_ASSETS_MARKET_DATA_INIT,
  UPDATE_SELECTED_VAULT_DETAILS,
  UPDATE_TRANSACTIONS_DRAGO_HOLDER,
  UPDATE_TRANSACTIONS_DRAGO_MANAGER,
  UPDATE_TRANSACTIONS_VAULT_HOLDER,
  UPDATE_TRANSACTIONS_VAULT_MANAGER
} from '../actions/const'
import initialState from './initialState'

export function eventfulDragoReducer(
  state = initialState.transactionsDrago,
  action
) {
  switch (action.type) {
    case UPDATE_TRANSACTIONS_DRAGO_HOLDER:
      return {
        ...state,
        holder: {
          balances: action.payload[0],
          logs: action.payload[1]
        }
      }

    case UPDATE_TRANSACTIONS_DRAGO_MANAGER:
      return {
        ...state,
        manager: {
          list: action.payload[2],
          logs: action.payload[1],
          portfolio: { ...state.manager.logs }
        }
      }

    case UPDATE_SELECTED_DRAGO_DETAILS:
      return {
        ...state,
        selectedDrago: {
          ...state.selectedDrago,
          ...action.payload
        }
      }

    case UPDATE_SELECTED_DRAGO_DETAILS_CHART_ASSETS_MARKET_DATA_INIT: {
      console.log(action)
      let selectedDrago = { ...state.selectedDrago }
      console.log(selectedDrago)
      selectedDrago.assetsCharts = {
        ...selectedDrago.assetsCharts,
        ...action.payload
      }
      return {
        ...state,
        selectedDrago: { ...state.selectedDrago, ...selectedDrago }
      }
    }

    case UPDATE_SELECTED_DRAGO_DETAILS_CHART_ASSETS_MARKET_ADD_DATAPOINT: {
      let selectedDrago = { ...state.selectedDrago }
      console.log(action)
      console.log(Object.keys(action.payload)[0])
      console.log(action.payload[Object.keys(action.payload)[0]])
      let symbol = Object.keys(action.payload)[0]
      let newTicker = action.payload[symbol].data
      let oldData = selectedDrago.assetsCharts[symbol].data
      // let newChartData = [...state.chartData]
      console.log(newTicker.epoch, oldData[oldData.length - 1].epoch)
      if (newTicker.epoch === oldData[oldData.length - 1].epoch) {
        oldData[oldData.length - 1] = newTicker
        console.log('first')
        return {
          ...state,
          selectedDrago: { ...state.selectedDrago, ...selectedDrago }
        }
      }
      if (newTicker.epoch === oldData[oldData.length - 2].epoch) {
        oldData[oldData.length - 2] = newTicker
        console.log('second')
        return {
          ...state,
          selectedDrago: { ...state.selectedDrago, ...selectedDrago }
        }
      }

      // oldData.pop()
      console.log('***** NEW *****')
      // console.log(action.payload)
      oldData.push(newTicker)
      selectedDrago.assetsCharts[symbol].data = oldData
      return {
        ...state,
        selectedDrago: { ...state.selectedDrago, ...selectedDrago }
      }
    }

    default:
      return state
  }
}

export function eventfulVaultReducer(
  state = initialState.transactionsVault,
  action
) {
  switch (action.type) {
    case UPDATE_TRANSACTIONS_VAULT_HOLDER:
      return {
        ...state,
        holder: {
          balances: action.payload[0],
          logs: action.payload[1]
        }
      }
    case UPDATE_TRANSACTIONS_VAULT_MANAGER:
      return {
        ...state,
        manager: {
          list: action.payload[2],
          logs: action.payload[1]
        }
      }
    case UPDATE_SELECTED_VAULT_DETAILS:
      return {
        ...state,
        selectedVault: {
          ...state.selectedVault,
          ...action.payload
        }
      }
    default:
      return state
  }
}
