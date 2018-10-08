// Copyright 2016-2017 Rigo Investment Sagl.

import { Col, Row } from 'react-flexbox-grid'
import { Dialog, FlatButton } from 'material-ui'
import ActionsDialogHeader from '../_atomic/molecules/actionsDialogHeader'
import NotificationWifi from 'material-ui/svg-icons/notification/wifi'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './elementActionAuthorization.module.css'

export default class ElementActionAuthorization extends Component {
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    account: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    authMsg: PropTypes.string.isRequired,
    tokenDetails: PropTypes.object
  }

  static defaultProps = {
    onClose: null,
    tokenDetails: null
  }

  state = {
    open: true
  }

  buttonsStyle = {
    marginTop: 12,
    marginBottom: 12,
    color: 'white'
  }

  handleClose = () => {
    // Executing onClose function passed by parent if exists, otherwise setting state.
    if (this.props.onClose !== null) {
      this.props.onClose()
    } else {
      this.setState({
        open: false
      })
    }
  }

  renderHeader = () => {}

  renderHeader = () => {
    const { tokenDetails } = this.props
    return (
      <ActionsDialogHeader
        primaryText="Authorize action"
        fundType="drago"
        tokenDetails={tokenDetails}
      />
    )
  }

  render() {
    const { authMsg, account } = this.props
    const titleStyle = {
      padding: 0,
      lineHeight: '20px',
      fontSize: 16
    }
    console.log(this.props)
    const actions = [
      <FlatButton
        key="CloseButton"
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />
    ]
    return (
      <Dialog
        title={this.renderHeader()}
        titleStyle={titleStyle}
        modal
        open={this.state.open}
        actions={actions}
      >
        <Row className={styles.container}>
          <Col xs={12}>
            <span style={{ borderBottom: '1px dotted' }}>{authMsg}</span>
          </Col>
          <Col xs={12}>
            Please check your{' '}
            {account.source.charAt(0).toUpperCase() + account.source.slice(1)}{' '}
            wallet and authorize this transaction.
          </Col>
          <Col xs={12}>
            Click on the {<NotificationWifi color={'#054186'} />} icon in the
            top bar to track the progress of your transaction.
          </Col>
          <Col xs={12}>
            Transactions can take up to 45 seconds to be mined into a new block.
          </Col>
        </Row>
      </Dialog>
    )
  }
}
