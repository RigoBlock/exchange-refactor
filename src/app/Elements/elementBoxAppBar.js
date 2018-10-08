import * as Colors from 'material-ui/styles/colors'
import { Col, Row } from 'react-flexbox-grid'
import AppBar from 'material-ui/AppBar'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class ElementBoxAppBar extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  render() {
    const priceBoxHeader = {
      marketPrice: {
        backgroundColor: '#054186',
        fontWeight: 500
      }
    }

    const priceBoxHeaderTitleStyle = {
      padding: 0,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 500
    }

    return (
      <div>
        <Row>
          <Col xs={12}>
            <AppBar
              title={this.props.title}
              showMenuIconButton={false}
              style={priceBoxHeader.marketPrice}
              titleStyle={priceBoxHeaderTitleStyle}
            />
          </Col>
        </Row>
      </div>
    )
  }
}
