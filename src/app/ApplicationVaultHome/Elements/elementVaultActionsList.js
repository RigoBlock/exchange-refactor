// Copyright 2016-2017 Rigo Investment Sagl.

import ButtonManage from '../../_atomic/atoms/buttonManage'
import ElementVaultActionSetFees from '../Elements/elementVaultActionSetFees'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Subheader from 'material-ui/Subheader'

export default class ElementVaultActionsList extends Component {
  static propTypes = {
    accounts: PropTypes.array.isRequired,
    vaultDetails: PropTypes.object.isRequired,
    snackBar: PropTypes.func.isRequired
  }

  state = {
    openMenuActions: false,
    showActionMenuItem: {
      setFees: false
    }
  }

  handleOpenMenuActions = event => {
    this.setState({
      openMenuActions: true,
      anchorEl: event.currentTarget
    })
  }

  handleRequestClose = () => {
    this.setState({
      openMenuActions: !this.state.openMenuActions
    })
  }

  openActionForm = (event, value) => {
    this.setState({
      openMenuActions: false
    })
    switch (value) {
      case 'setFees':
        this.setState({
          showActionMenuItem: {
            setFees: !this.state.showActionMenuItem.setFees
          }
        })
        break
      default:
        return null
    }
    return null
  }

  render() {
    const { vaultDetails } = this.props
    // Selectiong only the account which is the owner of the Drago
    const accounts = this.props.accounts.filter(account => {
      return account.address === vaultDetails.addressOwner
    })
    return (
      <div>
        <ButtonManage handleOpenMenuActions={this.handleOpenMenuActions} />
        <Popover
          open={this.state.openMenuActions}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
        >
          <Menu desktop={true} onChange={this.openActionForm}>
            <Subheader inset={false}>Vault</Subheader>
            <MenuItem value="setFees" primaryText="Set Fees" />
          </Menu>
        </Popover>
        {this.state.showActionMenuItem.setFees ? (
          <ElementVaultActionSetFees
            accounts={accounts}
            vaultDetails={vaultDetails}
            openActionForm={this.openActionForm}
            snackBar={this.props.snackBar}
          />
        ) : null}
      </div>
    )
  }
}
