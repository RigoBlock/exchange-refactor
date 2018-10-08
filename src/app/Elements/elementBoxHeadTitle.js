// Copyright 2016-2017 Rigo Investment Sagl.

import { Col, Row } from 'react-flexbox-grid'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './elementBoxHeadTitle.module.css'

export default class ElementBoxHeadTitle extends Component {
  static propTypes = {
    primaryText: PropTypes.string.isRequired
  }

  render = () => {
    return (
      <Row className={styles.header}>
        <Col xs={12}>
          <Row className={styles.headerText} middle="xs">
            <Col xs>{this.props.primaryText}</Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
