import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './lockErrorMessage.module.css'

class LockErrorMessage extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired
  }

  static defaultProps = {
    message: ''
  }

  render() {
    return <div className={styles.message}>{this.props.message}</div>
  }
}

export default LockErrorMessage
