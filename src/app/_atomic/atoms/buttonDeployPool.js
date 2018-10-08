import * as Colors from 'material-ui/styles/colors'
import { poolStyle } from '../../_utils/const'
import Add from 'material-ui/svg-icons/content/add'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

class ButtonDeployPool extends Component {
  static propTypes = {
    handleOpen: PropTypes.func.isRequired,
    fundType: PropTypes.string
  }

  static defaultProps = {
    fundType: 'drago'
  }

  render() {
    const buttonAccountType = {
      drago: {
        border: '1px solid',
        borderColor: poolStyle[this.props.fundType].color
      },
      vault: {
        border: '1px solid',
        borderColor: poolStyle[this.props.fundType].color
      }
    }

    const iconColor = poolStyle[this.props.fundType].color

    return (
      <div>
        <FlatButton
          label="Deploy"
          primary={true}
          onClick={this.props.handleOpen}
          labelStyle={{
            color: poolStyle[this.props.fundType].color,
            fontWeight: '700'
          }}
          backgroundColor={'#ffffff'}
          hoverColor={Colors.blueGrey50}
          icon={<Add color={iconColor} />}
          style={buttonAccountType[this.props.fundType]}
        />
      </div>
    )
  }
}

export default ButtonDeployPool
