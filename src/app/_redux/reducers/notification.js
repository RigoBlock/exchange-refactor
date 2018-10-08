// Copyright 2016-2017 Rigo Investment Sagl.

import { INIT_NOTIFICATION } from '../actions/const'
import initialState from './initialState'

function notificationsReducer(state = initialState.notifications, action) {
  switch (action.type) {
    case INIT_NOTIFICATION:
      console.log(action)
      return {
        ...state,
        engine: action.payload
      }
    default:
      return state
  }
}

export default notificationsReducer
