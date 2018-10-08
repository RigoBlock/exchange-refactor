import HelpOutline from 'material-ui/svg-icons/action/help-outline'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import styles from './helpIcon.module.css'

export default class HelpIcon extends Component {
  static propTypes = {
    style: PropTypes.object,
    helpText: PropTypes.string.isRequired,
    helpReadMoreLink: PropTypes.string
  }

  static defaultProps = {
    style: {},
    helpText: '',
    helpReadMoreLink: ''
  }

  state = {
    popoverIsOpen: true,
    preferPlace: null,
    place: 'below'
  }

  togglePopover(toState) {
    const popoverIsOpen =
      typeof toState === 'boolean' ? toState : !this.state.popoverIsOpen
    this.setState({
      popoverIsOpen
    })
  }

  onClickTooltipContent(e) {
    // do not hide tooltip when clicking inside tooltip content area
    console.log('clickl')
    e.stopPropagation()
    console.log('clickl')
  }

  render() {
    const tooltipStyle = {
      pointerEvents: 'auto', // enable click/selection etc. events inside tooltip
      overflowY: 'auto' // make content scrollable,
    }

    return (
      <div>
        <div data-tip={this.props.helpText} data-event="click">
          {/* <span style={{ cursor: 'pointer' }}>
            <HelpOutline style={this.props.style} />
          </span> */}
          <div style={{ cursor: 'pointer' }}>
            <HelpOutline style={this.props.style} />
          </div>
          <ReactTooltip
            effect="solid"
            place="bottom"
            type="light"
            multiline={true}
            globalEventOff="click"
            // border={true}
            className={styles.helpicon}
          />
        </div>
      </div>
    )
  }
}
