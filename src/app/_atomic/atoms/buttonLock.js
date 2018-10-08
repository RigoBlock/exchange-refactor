import * as Colors from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

class ButtonLock extends Component {
  static propTypes = {
    onLockTocken: PropTypes.func.isRequired,
    buttonAction: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired
  }

  static defaultProps = {
    disabled: true
  }

  onLockTocken = event => {
    this.props.onLockTocken(event)
  }

  render() {
    const buttonBuyStyle = {
      border: '1px solid',
      borderColor: this.props.selected ? Colors.green400 : Colors.grey400,
      // backgroundColor: this.props.selected ? Colors.green400 : 'white',
      width: '100%',
      height: '24px',
      lineHeight: '24px'
    }

    const labelStyle = {
      fontWeight: 700,
      fontSize: '12px'
      // color: this.props.selected ? 'white' : Colors.grey400
    }

    return (
      <div>
        <FlatButton
          primary={true}
          label={this.props.buttonAction}
          labelStyle={labelStyle}
          onClick={() => this.onLockTocken(this.props.buttonAction)}
          style={buttonBuyStyle}
          hoverColor={Colors.lightBlue50}
          disabled={this.props.disabled}
        />
      </div>
    )
  }
}

export default ButtonLock
