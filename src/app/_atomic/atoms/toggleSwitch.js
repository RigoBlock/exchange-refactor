// Copyright 2016-2017 Rigo Investment Sagl.

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import Toggle from 'material-ui/Toggle'

export default class ToggleSwitch extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
    toggled: PropTypes.bool.isRequired,
    toolTip: PropTypes.string,
    disabled: PropTypes.bool
  }

  static defaultProps = {
    toolTip: 'Activate trading',
    disabled: false
  }

  render() {
    const aggregatedTogglestyles = {
      block: {
        maxWidth: 150,
        marginLeft: 'auto'
      },
      toggle: {
        // paddingRight: '5px',
      },
      trackSwitched: {
        backgroundColor: '#bdbdbd'
      },
      thumbSwitched: {
        backgroundColor: '#054186'
      },
      labelStyle: {
        fontSize: '12px',
        opacity: '0.5',
        textAlign: 'right'
      }
    }

    return (
      <div data-tip={this.props.toolTip} style={aggregatedTogglestyles.block}>
        <Toggle
          label={this.props.label}
          style={aggregatedTogglestyles.toggle}
          // thumbStyle={aggregatedTogglestyles.thumbOff}
          trackStyle={aggregatedTogglestyles.trackOff}
          thumbSwitchedStyle={aggregatedTogglestyles.thumbSwitched}
          trackSwitchedStyle={aggregatedTogglestyles.trackSwitched}
          labelStyle={aggregatedTogglestyles.labelStyle}
          onToggle={this.props.onToggle}
          toggled={this.props.toggled}
          disabled={this.props.disabled}
        />
        <ReactTooltip effect="solid" place="top" />
      </div>
    )
  }
}
