// Copyright 2016-2017 Rigo Investment Sagl.

import {
  IS_MANAGER,
  UPDATE_SELECTED_VAULT_DETAILS,
  UPDATE_TRANSACTIONS_VAULT_HOLDER,
  UPDATE_TRANSACTIONS_VAULT_MANAGER
} from './const'
import app from './app_actions'
import drago from './drago_actions'
import endpoint from './endpoint_actions'
import exchange from './exchange_actions'
import notifications from './notifications_actions'
import tokens from './tokens'
import transactions from './transactions'

class actions {
  app = app

  drago = drago

  exchange = exchange

  endpoint = endpoint

  notifications = notifications

  transactions = transactions

  vault = {
    updateSelectedVaultAction: results => {
      return {
        type: UPDATE_SELECTED_VAULT_DETAILS,
        payload: results
      }
    },
    updateTransactionsVaultHolderAction: results => {
      return {
        type: UPDATE_TRANSACTIONS_VAULT_HOLDER,
        payload: results
      }
    },
    updateTransactionsVaultManagerAction: results => {
      return {
        type: UPDATE_TRANSACTIONS_VAULT_MANAGER,
        payload: results
      }
    }
  }

  users = {
    isManagerAction: isManager => {
      return {
        type: IS_MANAGER,
        payload: isManager
      }
    }
  }

  tokens = tokens
}

let Actions = new actions()
export { Actions }
