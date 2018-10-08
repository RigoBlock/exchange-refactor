// Copyright 2016-2017 Rigo Investment Sagl.

import { Col, Row } from 'react-flexbox-grid'
import { TextField } from 'material-ui'
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './orderAmountInputField.module.css'

export default class OrderPrice extends Component {
  static propTypes = {
    orderPrice: PropTypes.string.isRequired,
    onChangePrice: PropTypes.func,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    disabled: false
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  state = {
    priceError: ''
  }

  onChangePrice = event => {
    // Checking valid positive number
    console.log(event.target.value)
    try {
      if (!new BigNumber(event.target.value).gt(0)) {
        this.setState({
          amountError: 'Please enter a valid positive number'
        })
        this.error = true
        this.props.onChangePrice(event.target.value, true)
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
      this.props.onChangePrice(event.target.value, true)
      return
    }
    this.props.onChangePrice(event.target.value, false)
  }

  render() {
    // const amount = Math.min(orderFillAmount, orderMaxAmount)
    return (
      <Row bottom="xs">
        <Col xs={12}>
          <TextField
            key="orderAmount"
            autoComplete="off"
            floatingLabelFixed
            floatingLabelText="Price"
            fullWidth
            errorText={this.state.priceError}
            name="orderAmount"
            id="orderPrice"
            value={this.props.orderPrice}
            onChange={this.onChangePrice}
            disabled={this.props.disabled}
          />
        </Col>
      </Row>
    )
  }
}
