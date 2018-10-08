import PropTypes from 'prop-types'
import React from 'react'

import { curveMonotoneX } from 'd3-shape'
import { scaleTime } from 'd3-scale'

import { AreaSeries } from 'react-stockcharts/lib/series'
import { Chart, ChartCanvas } from 'react-stockcharts'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'
// import {
// 	MouseCoordinates,
// 	CrossHairCursor,
// 	MouseCoordinateX,
// 	MouseCoordinateY
// } from "react-stockcharts/lib/coordinates";
import { fitWidth } from 'react-stockcharts/lib/helper'
// import { createVerticalLinearGradient, hexToRGBA } from "react-stockcharts/lib/utils";

// const canvasGradient = createVerticalLinearGradient([
// 	// { stop: 0, color: hexToRGBA("#b5d0ff", 0.2) },
// 	// { stop: 0.7, color: hexToRGBA("#6fa4fc", 0.4) },
// 	{ stop: 1, color: hexToRGBA("#0D47A1", 1) },
// ]);

class AssetChart extends React.Component {
  render() {
    // let now = new Date()
    // let yesterday = now.setDate(now.getDate() - 1)
    const { data, type, width, ratio } = this.props
    return (
      <ChartCanvas
        ratio={ratio}
        width={width}
        height={80}
        margin={{ left: 2, right: 2, top: 2, bottom: 10 }}
        seriesName="TOKEN"
        data={data}
        type={type}
        xAccessor={d => d.date}
        displayXAccessor={d => d.date}
        xScale={scaleTime()}
        // xExtents={[yesterday, now]}
        // xExtents={[new Date(2018,8,16), now]}
        mouseMoveEvent={false}
        panEvent={false}
        zoomEvent={false}
        // clamp={false}
      >
        <Chart id={0} yExtents={d => d.close}>
          {/* <defs>
						<linearGradient id="MyGradient" x1="0" y1="100%" x2="0" y2="0%">
							<stop offset="100%" stopColor="#0D47A1" stopOpacity={1} />
						</linearGradient>
					</defs> */}
          <XAxis
            axisAt="bottom"
            orient="bottom"
            ticks={5}
            fontSize={8}
            stroke="#ffffff"
            tickStroke="#0D47A1"
            tickSize={10}
            showTicks={true}
            innerTickSize={0}
            tickStrokeWidth={0}
            tickPadding={2}
          />
          {/* <YAxis axisAt="left" orient="left" /> */}
          <AreaSeries
            yAccessor={d => d.close}
            fill="#0D47A1"
            strokeWidth={0}
            interpolation={curveMonotoneX}
            // canvasGradient={canvasGradient}
          />
        </Chart>
        {/* <MouseCoordinates type="crosshair" /> */}
      </ChartCanvas>
    )
  }
}

AssetChart.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(['svg', 'hybrid']).isRequired
}

AssetChart.defaultProps = {
  type: 'svg'
}
AssetChart = fitWidth(AssetChart)

export default AssetChart
