// Copyright 2016-2017 Rigo Investment Sagl.

import { Col, Row } from 'react-flexbox-grid'
import { MenuItem, SelectField } from 'material-ui'
import { RELAYS } from '../../_utils/const'
import ExchangeItem from '../atoms/exchangeSelectItem'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class ExchangeSelector extends Component {
  static propTypes = {
    availableRelays: PropTypes.object.isRequired,
    selectedRelay: PropTypes.string.isRequired,
    onSelectExchange: PropTypes.func.isRequired
  }

  onSelectExchange = (event, key, payload) => {
    this.props.onSelectExchange(payload)
  }

  renderExchange = () => {
    let menu = []
    // console.log(RELAYS)
    Object.keys(this.props.availableRelays).forEach(key => {
      // console.log(key)
      // console.log(RELAYS[key])
      menu.push(
        <MenuItem
          key={key}
          value={key}
          primaryText={<ExchangeItem exchange={RELAYS[key]} />}
        />
      )
    })
    return menu
  }

  render() {
    // console.log(this.props.selectedRelay)
    return (
      <Row>
        <Col xs={12}>
          <SelectField
            fullWidth
            value={this.props.selectedRelay}
            onChange={this.onSelectExchange}
            // style={{height: 90}}
          >
            {this.renderExchange()}
          </SelectField>
        </Col>
      </Row>
    )
  }
}
