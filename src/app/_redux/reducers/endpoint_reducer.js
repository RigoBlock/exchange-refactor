// Copyright 2016-2017 Rigo Investment Sagl.

import { UPDATE_INTERFACE } from '../actions/const'
import initialState from './initialState'

function endpointsReducer(state = initialState.endpoint, action) {
  let endpoint = {}
  switch (action.type) {
    case UPDATE_INTERFACE:
      console.log(endpoint)
      return {
        ...state,
        ...action.payload
      }

    default:
      return state
  }
}

export default endpointsReducer
