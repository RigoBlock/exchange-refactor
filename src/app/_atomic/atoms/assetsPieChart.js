import { Doughnut } from 'react-chartjs-2'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class AssetsPieChart extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    return (
      <div
        style={{
          height: '200px',
          width: '200px',
          textAlign: 'center',
          margin: 'auto'
        }}
      >
        <Doughnut
          data={this.props.data}
          width={200}
          height={200}
          options={{
            legend: {
              display: true,
              position: 'bottom'
            }
          }}
        />
      </div>
    )
  }
}
