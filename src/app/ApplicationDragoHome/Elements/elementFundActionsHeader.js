import { Col, Row } from 'react-flexbox-grid'
import FlatButton from 'material-ui/FlatButton'
import FundHeaderNameSymbol from '../../_atomic/atoms/fundHeaderNameSymbol'
import IdentityIcon from '../../_atomic/atoms/identityIcon'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './elementFundActionsHeader.module.css'

export default class ElementFundActionsHeader extends React.Component {
  static propTypes = {
    dragoDetails: PropTypes.object.isRequired,
    action: PropTypes.string.isRequired,
    handlebuyAction: PropTypes.func,
    handleSellAction: PropTypes.func
  }

  headerButtonsStyle = {
    selected: {
      fontWeight: 700,
      fontSize: 20,
      color: '#E3F2FD'
    },
    notSelected: {
      fontWeight: 700,
      fontSize: 20
    },
    bgSelected: '#1968c0',
    bGNotSelected: '#054186',
    hoverSelected: '#1968c0',
    hoverNotSelected: '#054186'
  }

  buttonsStyle = {
    marginTop: 12,
    marginBottom: 12,
    color: 'white'
  }

  setButtonStyle = action => {
    if (action === 'buy') {
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
      dragoDetails,
      action,
      handleBuyAction,
      handleSellAction
    } = this.props
    return (
      <Row className={styles.modalHeader}>
        <Col xs={12}>
          <Row className={styles.modalHeaderActions}>
            <Col xsOffset={4} xs={2}>
              <FlatButton
                label="Sell"
                style={this.buttonsStyle}
                backgroundColor={this.setButtonStyle(action).sellButtonStyleBg}
                labelStyle={this.setButtonStyle(action).sellButtonStyle}
                hoverColor="#1968c0"
                fullWidth={true}
                onClick={handleSellAction}
              />
            </Col>
            <Col xs={2}>
              <FlatButton
                label="Buy"
                style={this.buttonsStyle}
                backgroundColor={this.setButtonStyle(action).buyButtonStyleBg}
                labelStyle={this.setButtonStyle(action).buyButtonStyle}
                hoverColor="#1968c0"
                fullWidth={true}
                onClick={handleBuyAction}
              />
            </Col>
          </Row>
          <Row className={styles.modalTitle}>
            <Col xs={12} md={1} className={styles.dragoTitle}>
              <h2>
                <IdentityIcon address={dragoDetails.address} />
              </h2>
            </Col>
            <Col xs={12} md={11}>
              <div className={styles.dragoTitleContainer}>
                <FundHeaderNameSymbol
                  text
                  fundDetails={dragoDetails}
                  fundType="drago"
                  textColor=""
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}
