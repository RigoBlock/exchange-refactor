import * as Colors from 'material-ui/styles/colors'
import { Col, Row } from 'react-flexbox-grid'
import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import styles from './tableOrdersHistory.module.css'

class TableOrdersHistory extends Component {
  static propTypes = {
    orders: PropTypes.array.isRequired,
    onCancelOrder: PropTypes.func.isRequired
  }

  onCancelOrder = (event, id) => {
    event.preventDefault()
    console.log(id)
    console.log(this.props.orders[id])
    // this.props.onCancelOrder(this.props.orders[id])
  }

  renderTableRows = orders => {
    const orderTypeStyle = {
      asks: {
        color: Colors.red400,
        fontWeight: 700
      },
      bids: {
        color: Colors.green400,
        fontWeight: 700
      }
    }
    // console.log(orders)
    return orders.map((order, key) => {
      // console.log(order)
      return (
        <Row key={'order' + key} className={styles.rowText}>
          <Col xs={12}>
            <Row>
              <Col xs={2} style={orderTypeStyle[order.orderType]}>
                {order.orderType === 'asks' ? 'SELL' : 'BUY'}
              </Col>
              <Col xs={2}>{order.orderPrice}</Col>
              <Col xs={2}>{order.orderAmount}</Col>
              {/* <Col xs={2}>
                  {new Date(order.order.expirationUnixTimestampSec*1000).toLocaleString()}
                </Col> */}
              <Col xs={6} className={styles.tableTitleCellAction}>
                <a
                  id={key}
                  href="#"
                  onClick={event => this.onCancelOrder(event, key)}
                  className={styles.cancelLink}
                >
                  Cancel
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      )
    })
  }

  renderTableHeader = () => {
    return (
      <Row className={styles.tableTitle}>
        <Col xs={12}>
          <Row>
            <Col xs={2}>TYPE</Col>
            <Col xs={2}>PRICE</Col>
            <Col xs={2}>QUANTITY</Col>
            {/* <Col xs={2}>
                EXPIRES
              </Col> */}
            <Col xs={6} className={styles.tableTitleCellAction}>
              ACTION
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  render() {
    const { orders } = this.props
    // console.log(orders)

    return (
      <Row className={styles.containerOrders}>
        <Col xs={12}>
          {this.renderTableHeader()}
          {this.renderTableRows(orders)}
        </Col>
      </Row>
    )
  }
}

export default TableOrdersHistory
