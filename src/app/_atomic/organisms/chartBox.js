import { Col, Row } from 'react-flexbox-grid'
import { fitWidth } from 'react-stockcharts/lib/helper'
import BoxTitle from '../atoms/boxTitle'
import CandleStickChartWithMACDIndicator from './CandleStickChartWithMACDIndicator'
import Loading from '../atoms/loading'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './chartBox.module.css'

const paperStyle = {
  // paddingLeft: "12px"
}

class ChartBox extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool
  }

  static defaultProps = {
    type: 'svg',
    loading: true
  }

  render() {
    if (this.props.data.length === 0 || this.props.loading) {
      return (
        <Row>
          <Col xs={12}>
            <Row className={styles.sectionTitle}>
              <Col xs={12}>
                <BoxTitle titleText={'MARKET'} />
                <Paper style={paperStyle} zDepth={1}>
                  <Row className={styles.marketBoxContainer}>
                    <Col xs={12}>
                      <Loading size={35} />
                    </Col>
                  </Row>
                </Paper>
              </Col>
            </Row>
          </Col>
        </Row>
      )
    }

    return (
      <Row>
        <Col xs={12}>
          <Row className={styles.sectionTitle}>
            <Col xs={12}>
              <BoxTitle titleText={'MARKET'} />
              <Paper style={paperStyle} zDepth={1}>
                <Row className={styles.marketBoxContainer}>
                  <Col xs={12}>
                    <CandleStickChartWithMACDIndicator data={this.props.data} />
                  </Col>
                </Row>
              </Paper>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default fitWidth(ChartBox)
