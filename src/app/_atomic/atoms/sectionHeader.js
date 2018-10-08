import Divider from 'material-ui/Divider'
import HelpIcon from '../../_atomic/atoms/helpIcon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classNames from 'classnames'
import styles from './sectionHeader.module.css'

export default class SectionHeader extends Component {
  static propTypes = {
    titleText: PropTypes.string.isRequired,
    textStyle: PropTypes.object,
    containerStyle: PropTypes.object,
    help: PropTypes.bool,
    helpText: PropTypes.string,
    helpReadMoreLink: PropTypes.string,
    fundType: PropTypes.string
  }

  static defaultProps = {
    help: false,
    helpText: '',
    textStyle: { backgroundColor: '#054186' },
    containerStyle: {},
    helpReadMoreLink: '',
    fundType: 'drago'
  }

  render() {
    const helpIconStyle = {
      height: '20px',
      width: '20px',
      color: 'white'
    }

    const renderHelp = () => {
      return (
        <div className={styles.help}>
          <HelpIcon style={helpIconStyle} helpText={this.props.helpText} />
        </div>
      )
    }

    return (
      <div className={styles.container} style={this.props.containerStyle}>
        <div className={styles.actionButtonContainer}>
          {this.props.actionButton}
        </div>
        <div
          className={classNames(styles.title, styles[this.props.fundType])}
          style={this.props.textStyle}
        >
          {this.props.help ? renderHelp() : null}
          {this.props.titleText}
        </div>
        <Divider
          style={{
            ...this.props.textStyle
          }}
        />
      </div>
    )
  }
}
