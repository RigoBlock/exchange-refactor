import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class SyncStatusCurrentBlock extends Component {
  static propTypes = {
    syncStatus: PropTypes.object.isRequired
  }

  render() {
    const progressBlocks = () => {
      try {
        return new BigNumber(this.props.syncStatus.currentBlock)
          .div(new BigNumber(this.props.syncStatus.highestBlock))
          .times(100)
          .toFixed(2)
      } catch (error) {
        return 'n/a'
      }
    }
    const currentBlock = () => {
      try {
        return new BigNumber(this.props.syncStatus.currentBlock).toFormat()
      } catch (error) {
        return 'n/a'
      }
    }
    const highestBlock = () => {
      try {
        return new BigNumber(this.props.syncStatus.highestBlock).toFormat()
      } catch (error) {
        return 'n/a'
      }
    }
    return (
      <span>
        Block sync {currentBlock()} of {highestBlock()} ({progressBlocks()}
        %)
      </span>
    )
  }
}
