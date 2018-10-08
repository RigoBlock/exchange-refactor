// Copyright 2016-2017 Rigo Investment Sarl.

import { UPDATE_APP_STATUS } from './const'

const tokens = {
  updateAppStatus: status => {
    return {
      type: UPDATE_APP_STATUS,
      payload: status
    }
  }
}

export default tokens
