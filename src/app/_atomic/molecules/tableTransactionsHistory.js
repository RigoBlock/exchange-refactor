import * as Colors from 'material-ui/styles/colors'
import { Col, Row } from 'react-flexbox-grid'
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { UPDATE_SELECTED_ORDER } from '../../_redux/actions/const'
import { connect } from 'react-redux'
import { detect } from 'detect-browser'
import styles from './tableOrderBook.module.css'

function mapStateToProps(state) {
  return state
}

class TableTranscationsHistory extends Component {
  static propTypes = {
    orders: PropTypes.array.isRequired,
    orderType: PropTypes.string.isRequired,
    exchange: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  updateSelectedOrder = order => {
    const { selectedTokensPair } = this.props.exchange
    const payload = {
      details: { ...order },
      orderAmountError: false,
      orderPriceError: false,
      orderFillAmount: order.orderAmount,
      orderMaxAmount: order.orderAmount,
      orderPrice: order.orderPrice,
      orderType: order.orderType,
      takerOrder: true,
      selectedTokensPair: selectedTokensPair
    }
    return {
      type: UPDATE_SELECTED_ORDER,
      payload: payload
    }
  }

  onClickOrder = id => {
    console.log(id)
    let order = this.props.orders[id]
    console.log(order)
    this.props.dispatch(this.updateSelectedOrder(order))
  }

  renderRows = ordersSorted => {
    const { orderType } = this.props
    let price, amount
    const orderStylePrice = {
      asks: {
        color: Colors.red400
      },
      bids: {
        color: Colors.green400
      }
    }

    const orderStyleAmount = {
      asks: {
        color: Colors.red400
      },
      bids: {
        color: Colors.green400
      }
    }

    const progressBarAmountColor = {
      asks: Colors.red100,
      bids: Colors.green100
    }

    // var arr = [1,2,3];
    // var max1 = arr.reduce(function(a, b) {
    //   console.log(a, b)
    //     return Math.max(a, b);
    // });

    let max = ordersSorted.reduce(function(prev, current) {
      return Number(prev.orderAmount) > Number(current.orderAmount)
        ? prev
        : current
    })
    return ordersSorted.map((order, key) => {
      let amountGradient
      price = order.orderPrice
      amount = order.orderAmount

      const relativeToTotal = new BigNumber(amount)
        .dividedBy(new BigNumber(max.orderAmount))
        .times(100)
        .toFixed(0)

      const browser = detect()
      switch (browser && browser.name) {
        case 'chrome':
          amountGradient = `-webkit-linear-gradient(left, ${
            progressBarAmountColor[orderType]
          } ${relativeToTotal}%, ${
            progressBarAmountColor[orderType]
          } ${relativeToTotal}%, rgba(255,255,255,1) ${relativeToTotal}%, rgba(255,255,255,1) 100%)`
          break
        case 'firefox':
          amountGradient = `-moz-linear-gradient(left, ${
            progressBarAmountColor[orderType]
          } ${relativeToTotal}%, ${
            progressBarAmountColor[orderType]
          } ${relativeToTotal}%, rgba(255,255,255,1) ${relativeToTotal}%, rgba(255,255,255,1) 100%)`
          break
        case 'edge':
          amountGradient = `-ms-linear-gradient(left, ${
            progressBarAmountColor[orderType]
          } ${relativeToTotal}%, ${
            progressBarAmountColor[orderType]
          } ${relativeToTotal}%, rgba(255,255,255,1) ${relativeToTotal}%, rgba(255,255,255,1) 100%)`
          break
        default:
          amountGradient = `linear-gradient(left, ${
            progressBarAmountColor[orderType]
          } ${relativeToTotal}%, ${
            progressBarAmountColor[orderType]
          } ${relativeToTotal}%, rgba(255,255,255,1) ${relativeToTotal}%, rgba(255,255,255,1) 100%)`
      }
      return (
        <Row key={'order' + key}>
          <Col
            xs={12}
            className={styles.sectionOrder}
            id={key}
            onClick={() => this.onClickOrder(key)}
          >
            <Row className={styles.cellOrder}>
              <Col
                xs={2}
                style={{
                  ...orderStyleAmount[orderType],
                  backgroundImage: amountGradient
                }}
              />
              <Col xs={5} style={orderStylePrice[orderType]}>
                {amount}
              </Col>
              <Col xs={5} style={orderStylePrice[orderType]}>
                {price}
              </Col>
            </Row>
          </Col>
        </Row>
      )
    })
  }

  render() {
    const { orders } = this.props
    // console.log(orders)

    return (
      <Row className={styles.containerOrders}>
        <Col xs={12}>{this.renderRows(orders)}</Col>
      </Row>
    )
  }
}

export default connect(mapStateToProps)(TableTranscationsHistory)
