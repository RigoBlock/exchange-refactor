import * as Colors from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './buyButton.module.css'

class ButtonSell extends Component {
  static propTypes = {
    onBuySell: PropTypes.func.isRequired,
    selected: PropTypes.bool
  }

  static defaultProps = {
    selected: false
  }

  buttonSellClick = () => {
    this.props.onBuySell('asks')
  }

  render() {
    const buttonSellStyle = {
      border: '1px solid',
      borderColor: this.props.selected ? Colors.red400 : Colors.grey400,
      backgroundColor: this.props.selected ? Colors.red400 : 'white',
      width: '100%'
    }

    const labelStyle = {
      fontWeight: 700,
      fontSize: '18px',
      color: this.props.selected ? 'white' : Colors.grey400
    }

    return (
      <div className={styles.actionButton}>
        <FlatButton
          primary={true}
          label="Sell"
          labelStyle={labelStyle}
          onClick={this.buttonSellClick}
          style={buttonSellStyle}
          hoverColor={Colors.red50}
        />
      </div>
    )
  }
}

export default ButtonSell
