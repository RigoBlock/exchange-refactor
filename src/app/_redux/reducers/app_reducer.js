// Copyright 2016-2017 Rigo Investment Sagl.

import { UPDATE_APP_STATUS } from '../actions/const'
import initialState from './initialState'

function appReducer(state = initialState.app, action) {
  switch (action.type) {
    case UPDATE_APP_STATUS:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export default appReducer
