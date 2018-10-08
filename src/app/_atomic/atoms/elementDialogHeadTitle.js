// Copyright 2016-2017 Rigo Investment Sagl.

import { Col, Row } from 'react-flexbox-grid'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './elementDialogHeadTitle.module.css'

export default class ElementDialogHeadTitle extends Component {
  static propTypes = {
    primaryText: PropTypes.string.isRequired,
    fundType: PropTypes.string
  }

  static defaultProps = {
    fundType: 'drago'
  }

  render = () => {
    const style = {
      drago: {
        backgroundColor: '#054186'
      },
      vault: {
        backgroundColor: '#607D8B'
      }
    }
    // console.log(this.props)
    return (
      <Row className={styles.modalHeader}>
        <Col xs={12}>
          <Row
            className={styles.modalHeaderActions}
            middle="xs"
            center="xs"
            style={style[this.props.fundType]}
          >
            <Col xs>{this.props.primaryText}</Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
