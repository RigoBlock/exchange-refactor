// Copyright 2016-2017 Rigo Investment Sagl.

import { IS_MANAGER } from '../actions/const'
import initialState from './initialState'

function usersReducer(state = initialState.user, action) {
  switch (action.type) {
    case IS_MANAGER:
      let isManager = action.payload
      return {
        ...state,
        isManager
      }
    default:
      return state
  }
}

export default usersReducer
