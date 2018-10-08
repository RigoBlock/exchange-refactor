// Copyright 2016-2017 Rigo Investment Sagl.

import { Col, Row } from 'react-flexbox-grid'
import { TextField } from 'material-ui'
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
// import styles from './tokenLockAmountField.module.css'

export default class TokenLockTimeField extends Component {
  static propTypes = {
    isBaseToken: PropTypes.bool.isRequired,
    onChangeTime: PropTypes.func.isRequired,
    amount: PropTypes.string.isRequired
  }

  static defaultProps = {
    amount: 1,
    baseToken: true
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  state = {
    amountError: ''
  }

  onChangeTime = event => {
    // Checking valid positive number
    console.log(event.target.value)
    let amountError = 'Please enter a valid positive number'
    try {
      if (!new BigNumber(event.target.value).gt(0)) {
        this.setState({
          amountError: 'Please enter a valid positive number'
        })
        this.error = true
        this.props.onChangeTime(
          event.target.value,
          this.props.isBaseToken,
          amountError
        )
        return
      } else {
        this.setState({
          amountError: ''
        })
      }
    } catch (error) {
      this.setState({
        amountError: 'Please enter a valid positive number'
      })
      this.error = true
      this.props.onChangeTime(
        event.target.value,
        this.props.isBaseToken,
        amountError
      )
      return
    }
    console.log('ok')
    this.props.onChangeTime(event.target.value, this.props.isBaseToken, '')
  }

  render() {
    return (
      <Row bottom="xs">
        <Col xs={12}>
          <TextField
            key={
              this.props.isBaseToken
                ? 'baseTokenTimeFieldKey'
                : 'quoteTokenTimeFieldKey'
            }
            autoComplete="off"
            fullWidth
            // errorText={this.state.amountError}
            name="tokenLockAmount"
            id={
              this.props.isBaseToken
                ? 'baseTokenTimeFieldId'
                : 'quoteTokenTimeFieldId'
            }
            value={this.props.amount}
            style={{ height: 'unset' }}
            // underlineShow={false}
            underlineStyle={{ bottom: '0px' }}
            onChange={this.onChangeTime}
          />
        </Col>
      </Row>
    )
  }
}
