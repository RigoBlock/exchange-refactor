import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import styles from './chipTokenGRG.module.css'

class ChipTokenGRG extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired
  }

  render() {
    const { account } = this.props
    return (
      <Chip
        style={{ border: '1px solid', borderColor: '#E0E0E0', padding: '1px' }}
        backgroundColor="#FFFFFF"
      >
        <Avatar
          src="img/Logo-RigoblockRGB-OUT-02.png"
          style={{ border: '1px solid' }}
          backgroundColor="#FFFFFF"
        />
        {Number(account.grgBalance).toLocaleString(undefined, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3
        })}{' '}
        <span className={styles.tokensSymbolText}>GRG</span>
      </Chip>
    )
  }
}

export default ChipTokenGRG
