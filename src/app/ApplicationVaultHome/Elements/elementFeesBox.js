import * as Colors from 'material-ui/styles/colors'
import { Col, Row } from 'react-flexbox-grid'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import styles from './elementFeesBox.module.css'

export default class ElementFeesBox extends Component {
  static propTypes = {
    vaultDetails: PropTypes.object.isRequired,
    accounts: PropTypes.array,
    handleBuySellButtons: PropTypes.func,
    isManager: PropTypes.bool
  }

  buttonBuyClick = () => {
    this.props.handleBuySellButtons('deposit')
  }

  buttonSellClick = () => {
    this.props.handleBuySellButtons('withdraw')
  }

  render() {
    const { vaultDetails, isManager } = this.props

    const buttonStyle = {
      border: '1px solid',
      borderColor: Colors.blueGrey200,
      width: '140px'
    }
    if (!isManager) {
      return (
        <div>
          <Row middle="xs">
            <Col xs={12}>
              <div className={styles.price}>{vaultDetails.fee} %</div>
            </Col>
          </Row>
          <Row middle="xs">
            <Col xs={6}>
              <div className={styles.actionButton}>
                <FlatButton
                  primary={true}
                  label="Withdraw"
                  labelStyle={{ fontWeight: 700, fontSize: '18px' }}
                  onClick={this.buttonSellClick}
                  style={buttonStyle}
                />
              </div>
            </Col>
            <Col xs={6}>
              <div className={styles.actionButton}>
                <FlatButton
                  primary={true}
                  label="Deposit"
                  labelStyle={{ fontWeight: 700, fontSize: '18px' }}
                  onClick={this.buttonBuyClick}
                  style={buttonStyle}
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
            <Col xs={12}>
              <div className={styles.price}>{vaultDetails.fee} %</div>
            </Col>
          </Row>
          {/* <Row middle="xs">
            <Col xs={6}>
              <div className={styles.actionButton}><FlatButton primary={true} label="Withdraw"
                labelStyle={{ fontWeight: 700, fontSize: '18px' }}
                onClick={this.buttonSellClick}
                style={buttonStyle}
              /></div>

            </Col>
            <Col xs={6}>
              <div className={styles.actionButton}><FlatButton primary={true} label="Deposit"
                labelStyle={{ fontWeight: 700, fontSize: '18px' }}
                // onClick={this.buttonBuyClick}
                onClick={this.buttonBuyClick}
                style={buttonStyle}
              /></div>
            </Col>
          </Row> */}
        </div>
      )
    }
  }
}
