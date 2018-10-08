// Copyright 2016-2017 Rigo Investment Sagl.

import { Col, Row } from 'react-flexbox-grid'
import IdentityIcon from './identityIcon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './elementDialogAddressTitle.module.css'

export default class ElementDialogAddressTitle extends Component {
  static propTypes = {
    tokenDetails: PropTypes.object.isRequired
  }

  render = () => {
    const { tokenDetails } = this.props
    return (
      <Row className={styles.modalTitle}>
        <Col xs={12} md={1} className={styles.dragoTitle}>
          <h2>
            <IdentityIcon address={tokenDetails.address} />
          </h2>
        </Col>
        <Col xs={12} md={11} className={styles.dragoTitle}>
          <p>
            {typeof tokenDetails.symbol !== 'undefined'
              ? tokenDetails.symbol + ' | '
              : null}
            {tokenDetails.name}{' '}
          </p>
          {typeof tokenDetails.address !== 'undefined' ? (
            <small>{tokenDetails.address}</small>
          ) : null}
        </Col>
      </Row>
    )
  }
}
