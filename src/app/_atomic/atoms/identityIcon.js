// Copyright 2016-2017 Rigo Investment Sagl.

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './identityIcon.module.css'

export default class IdentityIcon extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    size: PropTypes.string,
    customStyle: PropTypes.object
  }

  static defaultProps = {
    size: '40px',
    customStyle: {}
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  render() {
    const { address, size } = this.props
    const { api } = this.context

    return (
      <img
        className={styles.icon}
        style={{ width: size, height: size, ...this.props.customStyle }}
        src={api.util.createIdentityImg(address, 4)}
      />
    )
  }
}
