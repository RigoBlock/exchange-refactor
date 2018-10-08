import React, { Component } from 'react'
import styles from './elementFundNotFound.module.css'

class ElementFundNotFound extends Component {
  static propTypes = {}

  render() {
    return (
      <div className={styles.warnMsgBox}>
        <h4>Drago not found.</h4>
        <p>We could not find this Drago on the blackchain.</p>
        <p>Please make sure that your client is in sync.</p>
      </div>
    )
  }
}

export default ElementFundNotFound
