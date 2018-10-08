// Copyright 2016-2017 Rigo Investment Sagl.

import { MenuItem, SelectField } from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import SelectTokenItem from './selectTokenItem.js'

export default class TokenSelector extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    onSelectToken: PropTypes.func.isRequired
  }

  state = {
    value: 0
  }

  onSelect = (event, key) => {
    console.log(key)
    let tokens = {
      0: 'ETH',
      1: 'GRG'
    }
    this.setState({
      value: key
    })
    this.props.onSelectToken(tokens[key])
  }

  render() {
    const { account } = this.props
    return (
      <div>
        <SelectField
          floatingLabelText="Type of token transfer"
          fullWidth
          value={this.state.value}
          onChange={this.onSelect}
          style={{ height: 90 }}
        >
          <MenuItem
            value={0}
            primaryText={<SelectTokenItem account={account} token="ETH" />}
          />
          <MenuItem
            value={1}
            primaryText={<SelectTokenItem account={account} token="GRG" />}
          />
        </SelectField>
      </div>
    )
  }
}
