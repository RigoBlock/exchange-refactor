import { Col, Row } from 'react-flexbox-grid'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TokenLockInfo from '../molecules/tokenLockInfo'
import styles from './chartBox.module.css'

class TokensLockBox extends Component {
  static propTypes = {
    selectedFund: PropTypes.object.isRequired,
    selectedTokensPair: PropTypes.object.isRequired,
    selectedExchange: PropTypes.object.isRequired,
    selectedRelay: PropTypes.object.isRequired
  }

  static defaultProps = {}

  render() {
    return (
      <Row>
        <Col xs={12}>
          <Row className={styles.sectionTitle}>
            <Col xs={12}>
              <TokenLockInfo
                selectedFund={this.props.selectedFund}
                selectedTokensPair={this.props.selectedTokensPair}
                selectedExchange={this.props.selectedExchange}
                selectedRelay={this.props.selectedRelay}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default TokensLockBox
