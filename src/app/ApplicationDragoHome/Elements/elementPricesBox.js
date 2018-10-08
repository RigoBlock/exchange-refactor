import * as Colors from 'material-ui/styles/colors'
import { Col, Row } from 'react-flexbox-grid'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './elementPricesBox.module.css'

export default class ElementPriceBox extends Component {
  static propTypes = {
    dragoDetails: PropTypes.object.isRequired,
    handleBuySellButtons: PropTypes.func,
    isManager: PropTypes.bool.isRequired
  }

  static defaultProps = {
    handleBuySellButtons: input => input
  }

  buttonBuyClick = () => {
    this.props.handleBuySellButtons('buy')
  }

  buttonSellClick = () => {
    this.props.handleBuySellButtons('sell')
  }

  render() {
    const { dragoDetails, isManager } = this.props

    const buttonBuyStyle = {
      border: '1px solid',
      borderColor: Colors.green200
      // width: "140px"
    }

    const buttonSellStyle = {
      border: '1px solid',
      borderColor: Colors.red200
      // width: "140px"
    }

    if (!isManager) {
      return (
        <div>
          <Row middle="xs" className={styles.row}>
            <Col xs={6}>
              <div className={styles.price}>
                {dragoDetails.sellPrice}{' '}
                <small className={styles.tokenSymbol}>ETH</small>
              </div>
            </Col>
            <Col xs={6}>
              <div className={styles.price}>
                {dragoDetails.buyPrice}{' '}
                <small className={styles.tokenSymbol}>ETH</small>
              </div>
            </Col>
          </Row>
          <Row middle="xs" className={styles.row}>
            <Col xs={6}>
              <div className={styles.actionButton}>
                <FlatButton
                  primary={true}
                  label="Sell"
                  labelStyle={{
                    fontWeight: 700,
                    fontSize: '18px',
                    color: Colors.red500
                  }}
                  onClick={this.buttonSellClick}
                  style={buttonSellStyle}
                  hoverColor={Colors.red50}
                />
              </div>
            </Col>
            <Col xs={6}>
              <div className={styles.actionButton}>
                <FlatButton
                  primary={true}
                  label="Buy"
                  labelStyle={{
                    fontWeight: 700,
                    fontSize: '18px',
                    color: Colors.green500
                  }}
                  onClick={this.buttonBuyClick}
                  style={buttonBuyStyle}
                  hoverColor={Colors.lightGreen50}
                />
              </div>
            </Col>
          </Row>
        </div>
      )
    }

    if (isManager) {
      return (
        <div>
          <Row middle="xs">
            <Col xs={6}>
              <div className={styles.sellHeader}>BID</div>
            </Col>
            <Col xs={6}>
              <div className={styles.buyHeader}>ASK</div>
            </Col>
          </Row>
          <Row middle="xs">
            <Col xs={6}>
              <div className={styles.price}>
                {dragoDetails.sellPrice}{' '}
                <small className={styles.tokenSymbol}>ETH</small>
              </div>
            </Col>
            <Col xs={6}>
              <div className={styles.price}>
                {dragoDetails.buyPrice}{' '}
                <small className={styles.tokenSymbol}>ETH</small>
              </div>
            </Col>
          </Row>
        </div>
      )
    }
  }
}
