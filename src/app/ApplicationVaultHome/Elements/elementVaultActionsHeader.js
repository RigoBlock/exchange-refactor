import * as Colors from 'material-ui/styles/colors'
import { Col, Row } from 'react-flexbox-grid'
import FlatButton from 'material-ui/FlatButton'
import IdentityIcon from '../../_atomic/atoms/identityIcon'
import PropTypes from 'prop-types'
import React from 'react'

import styles from './elementVaultActionsHeader.module.css'

export default class ElementVaultActionsHeader extends React.Component {
  static propTypes = {
    vaultDetails: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    handlebuyAction: PropTypes.func,
    handleSellAction: PropTypes.func
  }

  headerButtonsStyle = {
    selected: {
      fontWeight: 700,
      fontSize: 20,
      color: Colors.blueGrey50
    },
    notSelected: {
      fontWeight: 700,
      fontSize: 20
    },
    bgSelected: Colors.blueGrey300,
    bGNotSelected: Colors.blueGrey500,
    hoverSelected: Colors.blueGrey300,
    hoverNotSelected: Colors.blueGrey500
  }

  buttonsStyle = {
    marginTop: 12,
    marginBottom: 12,
    color: 'white'
  }

  setButtonStyle = action => {
    if (action === 'deposit') {
      return {
        sellButtonStyleHover: this.headerButtonsStyle.hoverNotSelected,
        buyButtonStyleHover: this.headerButtonsStyle.hoverSelected,
        sellButtonStyleBg: this.headerButtonsStyle.bGNotSelected,
        buyButtonStyleBg: this.headerButtonsStyle.bgSelected,
        sellButtonStyle: this.headerButtonsStyle.notSelected,
        buyButtonStyle: this.headerButtonsStyle.selected
      }
    } else {
      return {
        sellButtonStyleHover: this.headerButtonsStyle.hoverSelected,
        buyButtonStyleHover: this.headerButtonsStyle.hoverNotSelected,
        sellButtonStyleBg: this.headerButtonsStyle.bgSelected,
        buyButtonStyleBg: this.headerButtonsStyle.bGNotselected,
        sellButtonStyle: this.headerButtonsStyle.selected,
        buyButtonStyle: this.headerButtonsStyle.notSelected
      }
    }
  }

  render() {
    const {
      vaultDetails,
      action,
      handleBuyAction,
      handleSellAction
    } = this.props
    return (
      <Row className={styles.modalHeader}>
        <Col xs={12}>
          <Row className={styles.modalHeaderActions}>
            <Col xsOffset={3} xs={3}>
              <FlatButton
                label="Withdraw"
                style={this.buttonsStyle}
                backgroundColor={this.setButtonStyle(action).sellButtonStyleBg}
                labelStyle={this.setButtonStyle(action).sellButtonStyle}
                hoverColor={Colors.blueGrey300}
                fullWidth={true}
                onClick={handleSellAction}
              />
            </Col>
            <Col xs={3}>
              <FlatButton
                label="Deposit"
                style={this.buttonsStyle}
                backgroundColor={this.setButtonStyle(action).buyButtonStyleBg}
                labelStyle={this.setButtonStyle(action).buyButtonStyle}
                hoverColor={Colors.blueGrey300}
                fullWidth={true}
                onClick={handleBuyAction}
              />
            </Col>
          </Row>
          <Row className={styles.modalTitle}>
            <Col xs={12} md={1} className={styles.dragoTitle}>
              <h2>
                <IdentityIcon address={vaultDetails.address} />
              </h2>
            </Col>
            <Col xs={12} md={11} className={styles.dragoTitle}>
              <p>
                {vaultDetails.symbol} | {vaultDetails.name}{' '}
              </p>
              <small>{vaultDetails.address}</small>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
