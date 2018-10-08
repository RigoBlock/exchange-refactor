import { Col, Row } from 'react-flexbox-grid'
import { toBaseUnitAmount } from '../../_utils/format'
import BigNumber from 'bignumber.js'
import Divider from 'material-ui/Divider'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import SectionTitleExchange from '../atoms/sectionTitleExchange'
import Web3 from 'web3'
import isNumber from 'is-number'

import classNames from 'classnames'
import styles from './orderSummary.module.css'

class OrderSummary extends PureComponent {
  static propTypes = {
    order: PropTypes.object.isRequired
  }

  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  render() {
    const { order } = this.props
    let fee, total, action
    const web3 = new Web3(Web3.currentProvider)
    // price = (order.orderPrice !== '') ? order.orderPrice : '0'
    // amount = (order.orderFillAmount !== '') ? order.orderFillAmount : '0'

    // price = (order.orderPrice !== '') ? order.orderPrice : '0'
    // amount = (order.orderFillAmount !== '') ? order.orderFillAmount : '0'

    const price = () => {
      try {
        new BigNumber(order.orderPrice)
        return order.orderPrice
      } catch (error) {
        return 0
      }
    }

    const amount = amount => {
      new BigNumber(amount)
      return isNumber(amount)
        ? new BigNumber(amount).toFixed(5)
        : new BigNumber(0).toFixed(5)
    }
    fee = new BigNumber(
      web3.utils.fromWei(order.details.order.takerFee, 'ether')
    ).toFixed(5)
    total = new BigNumber(price()).times(amount()).toFixed(5)

    order.takerOrder
      ? (action = order.orderType === 'asks' ? 'buy' : 'sell')
      : (action = order.orderType === 'bids' ? 'buy' : 'sell')

    return (
      <Row className={styles.containerOrders}>
        <Col xs={12} className={classNames(styles.action, styles[action])}>
          <div>{action.toUpperCase()}</div>
        </Col>
        <Col xs={12}>
          <SectionTitleExchange titleText="SUMMARY" />
        </Col>
        <Col xs={12} className={styles.summaryRow}>
          <div>Quantities</div>
        </Col>
        <Col xs={12} className={styles.summaryRow}>
          <Row>
            <Col xs={12}>
              <Row>
                <Col xs={2}>
                  <div>
                    <small>{order.selectedTokensPair.baseToken.symbol}</small>
                  </div>
                </Col>
                <Col xs={10}>
                  <div className={styles.amount}>
                    {amount(order.orderFillAmount)}
                  </div>
                </Col>
                <Col xs={2}>
                  <div>
                    <small>{order.selectedTokensPair.quoteToken.symbol}</small>
                  </div>
                </Col>
                <Col xs={10}>
                  <div className={styles.amount}>
                    {(amount(order.orderFillAmount) * price()).toFixed(5)}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={12} className={styles.summaryRow}>
          <Row>
            <Col xs={2}>
              <div>Price</div>
            </Col>
            <Col xs={10}>
              <div className={styles.amount}>
                {new BigNumber(price()).toFixed(5)}
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={12} className={styles.summaryRow}>
          <div>Fee</div>
        </Col>
        <Col xs={12} className={styles.summaryRow}>
          <Row>
            <Col xs={2}>
              <div>
                <small>ZRX</small>
              </div>
            </Col>

            <Col xs={10}>
              <div className={styles.amount}>{fee}</div>
            </Col>
          </Row>
        </Col>
        <Col xs={12} className={styles.summaryRow}>
          <Divider />
        </Col>
        {/* <Col xs={12} className={styles.summaryRow}>
          <Row>
            <Col xs={4}>
              <div>TOTAL</div>
            </Col>
            <Col xs={8}>
              <div>{total}</div>
              <Row>
                <Col xs={8}>
                  <div>{total}</div>
                </Col>
                <Col xs={2}>
                  <div>
                    <small>{order.selectedTokensPair.quoteToken.symbol}</small>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col> */}
      </Row>
    )
  }
}

export default OrderSummary
