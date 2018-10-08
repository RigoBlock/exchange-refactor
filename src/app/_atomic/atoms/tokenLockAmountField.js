// Copyright 2016-2017 Rigo Investment Sagl.

import { Col, Row } from 'react-flexbox-grid'
import { TextField } from 'material-ui'
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
// import styles from './tokenLockAmountField.module.css'

export default class TokenAmountInputField extends Component {
  static propTypes = {
    lockMaxAmount: PropTypes.object.isRequired,
    isBaseToken: PropTypes.bool.isRequired,
    onChangeAmount: PropTypes.func.isRequired,
    amount: PropTypes.string.isRequired,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    disabled: false,
    amount: 0,
    baseToken: true
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  state = {
    amountError: ''
  }

  onChangeAmount = event => {
    // Checking valid positive number
    console.log(event.target.value)
    let amountError = 'Please enter a valid positive number'
    try {
      if (!new BigNumber(event.target.value).gt(0)) {
        this.setState({
          amountError: 'Please enter a valid positive number'
        })
        this.error = true
        this.props.onChangeAmount(
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
      this.props.onChangeAmount(
        event.target.value,
        this.props.isBaseToken,
        amountError
      )
      return
    }
    console.log('ok')
    this.props.onChangeAmount(event.target.value, this.props.isBaseToken, '')
  }

  render() {
    return (
      <Row bottom="xs">
        <Col xs={12}>
          <TextField
            key={
              this.props.isBaseToken
                ? 'baseTokenFieldKey'
                : 'quoteTokenFieldKey'
            }
            autoComplete="off"
            fullWidth
            // errorText={this.state.amountError}
            name="tokenLockAmount"
            id={
              this.props.isBaseToken ? 'baseTokenFieldId' : 'quoteTokenFieldId'
            }
            value={this.props.amount}
            style={{ height: 'unset' }}
            // underlineShow={false}
            underlineStyle={{ bottom: '0px' }}
            onChange={this.onChangeAmount}
            disabled={this.props.disabled}
          />
        </Col>
      </Row>
    )
  }
}
