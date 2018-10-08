import { Col, Row } from 'react-flexbox-grid'
import BoxTitle from '../atoms/boxTitle'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TableOrderBook from '../molecules/tableOrderBook'
import ToggleSwitch from '../atoms/toggleSwitch'
import styles from './orderBook.module.css'

const paperStyle = {
  // paddingLeft: "12px"
}

class OrderBook extends Component {
  static propTypes = {
    bidsOrders: PropTypes.array.isRequired,
    asksOrders: PropTypes.array.isRequired,
    spread: PropTypes.string.isRequired,
    aggregated: PropTypes.bool.isRequired,
    onToggleAggregateOrders: PropTypes.func.isRequired,
    onlyAggregated: PropTypes.bool.isRequired
  }

  static defaultProps = {
    bidsOrders: [],
    asksOrders: [],
    spread: '0'
  }

  onToggleAggregateOrders = (event, isInputChecked) => {
    this.props.onToggleAggregateOrders(isInputChecked)
  }

  render() {
    const ordersAsksSorted = [].concat(this.props.asksOrders)
    const ordersBidsSorted = [].concat(this.props.bidsOrders)
    const spread = this.props.spread
    // console.log(ordersAsksSorted, ordersBidsSorted)
    // const aggregatedTogglestyles = {
    //   block: {
    //     maxWidth: 250,
    //   },
    //   toggle: {
    //     // paddingRight: '5px',
    //   },
    //   trackSwitched: {
    //     backgroundColor: '#bdbdbd',
    //   },
    //   thumbSwitched: {
    //     backgroundColor: '#054186',
    //   },
    //   labelStyle: {
    //     fontSize: '12px',
    //     opacity: '0.5',
    //     textAlign: 'right'
    //   },
    // };
    return (
      <Row>
        <Col xs={12}>
          <Row className={styles.sectionTitle}>
            <Col xs={12}>
              <BoxTitle titleText={'ORDER BOOK'} />
              <Paper style={paperStyle} zDepth={1}>
                <Row className={styles.orderBookContainer}>
                  <Col xs={12}>
                    <Row center="xs">
                      <Col xs={12}>
                        <div style={{ marginRight: '5px' }}>
                          <ToggleSwitch
                            label={'AGGREGATE'}
                            onToggle={this.onToggleAggregateOrders}
                            toggled={this.props.aggregated}
                            toolTip={'Aggregate orders'}
                            disabled={this.props.onlyAggregated}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Row className={styles.sectionHeaderOrderTable}>
                      <Col xs={6} className={styles.quantityText}>
                        QUANTITY
                      </Col>
                      <Col xs={6} className={styles.priceText}>
                        PRICE
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Row bottom="xs" className={styles.ordersContainer}>
                      <Col xs={12}>
                        {ordersAsksSorted.length !== 0 ? (
                          <TableOrderBook
                            aggregated={this.props.aggregated}
                            onlyAggregated={this.props.onlyAggregated}
                            key="asksBook"
                            orders={ordersAsksSorted}
                            orderType="asks"
                          />
                        ) : null}
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Row center="xs">
                      <Col xs={12}>
                        {spread === 0 ? (
                          <div className={styles.spread}>
                            <div style={{ paddingRight: '5px' }}>-</div>
                          </div>
                        ) : (
                          <div className={styles.spread}>
                            <div style={{ paddingRight: '5px' }}>{spread}</div>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12}>
                    <Row className={styles.ordersContainer}>
                      <Col xs={12}>
                        {ordersBidsSorted.length !== 0 ? (
                          <TableOrderBook
                            aggregated={this.props.aggregated}
                            onlyAggregated={this.props.onlyAggregated}
                            key="bidsBook"
                            orders={ordersBidsSorted}
                            orderType="bids"
                          />
                        ) : null}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Paper>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default OrderBook
