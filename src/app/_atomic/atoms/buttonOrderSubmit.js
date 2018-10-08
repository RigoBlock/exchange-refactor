import * as Colors from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './buttonOrderSubmit.module.css'

class ButtonOrderSubmit extends Component {
  static propTypes = {
    onSubmitOrder: PropTypes.func.isRequired,
    disabled: PropTypes.bool
  }

  render() {
    const buttonOrderSubmitStyle = {
      width: '100%'
    }

    return this.props.disabled ? (
      <div className={styles.buttonContainer}>
        <FlatButton
          label="Submit"
          labelStyle={{ fontWeight: 700, fontSize: '18px' }}
          onClick={this.props.onSubmitOrder}
          style={buttonOrderSubmitStyle}
          disabled={this.props.disabled}
        />
      </div>
    ) : (
      <div className={styles.buttonContainer}>
        <FlatButton
          primary={true}
          label="Submit"
          labelStyle={{ fontWeight: 700, fontSize: '18px', color: '#ffffff' }}
          onClick={this.props.onSubmitOrder}
          style={buttonOrderSubmitStyle}
          hoverColor={Colors.blue400}
          backgroundColor={'#054186'}
          disabled={this.props.disabled}
        />
      </div>
    )
  }
}

export default ButtonOrderSubmit
