import * as Colors from 'material-ui/styles/colors'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import React, { Component } from 'react'

class ButtonManage extends Component {
  static propTypes = {
    handleOpenMenuActions: PropTypes.func.isRequired
  }

  handleOpenMenuActions = event => {
    this.props.handleOpenMenuActions(event)
  }

  render() {
    const buttonActions = {
      border: '1px solid',
      borderColor: Colors.grey200,
      backgroundColor: '#ffffff'
    }

    return (
      <div>
        <RaisedButton
          onClick={this.handleOpenMenuActions}
          label="Manage"
          labelStyle={{ fontWeight: 700, color: '#000000' }}
          buttonStyle={buttonActions}
          backgroundColor="#ffffff"
        />
      </div>
    )
  }
}

export default ButtonManage
