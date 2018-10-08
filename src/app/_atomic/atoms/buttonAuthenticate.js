import React, { Component } from 'react'
// import  * as Colors from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'

class ButtonAuthenticate extends Component {
  static propTypes = {
    onAuthEF: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    selected: false,
    disabled: false
  }

  buttonAuthClick = () => {
    console.log('auth')
    this.props.onAuthEF()
  }

  render() {
    const buttonBuyStyle = {
      border: '1px solid',
      // borderColor: (this.props.selected ? Colors.green400 : Colors.grey400),
      // backgroundColor: (this.props.selected ? Colors.green400 : 'white'),
      width: '100%'
    }

    const labelStyle = {
      fontWeight: 700,
      fontSize: '18px'
      // color:  (this.props.selected ? 'white' : Colors.grey400 )
    }

    return (
      <div>
        <FlatButton
          primary={true}
          label="Authenticate"
          labelStyle={labelStyle}
          onClick={this.buttonAuthClick}
          style={buttonBuyStyle}
          // disabled={this.props.disabled}
          // hoverColor={Colors.lightGreen50}
        />
      </div>
    )
  }
}

export default ButtonAuthenticate
