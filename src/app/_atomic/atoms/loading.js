// Copyright 2016-2017 Gabrele Rigo

import * as Colors from 'material-ui/styles/colors'
import { CircularProgress } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './loading.module.css'

export default class Loading extends Component {
  static propTypes = {
    size: PropTypes.number
  }

  static defaultProps = {
    size: 60
  }

  render() {
    return (
      <div className={styles.loading}>
        <CircularProgress size={this.props.size} color={'#054186'} />
      </div>
    )
  }
}
