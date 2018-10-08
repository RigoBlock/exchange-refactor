import * as Colors from 'material-ui/styles/colors'
import { ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import LinearProgress from 'material-ui/LinearProgress'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Search from 'material-ui/svg-icons/action/search'
import styles from './elementNotification.module.css'

const transactionStyle = {
  executed: {
    backgroundColor: 'white',
    // border: '1px solid',
    borderRadius: '2px',
    // borderColor: Colors.green100,
    margin: '2px',
    progressBar: {
      color: Colors.green400,
      backgroundColor: Colors.green100
    }
  },
  authorization: {
    backgroundColor: 'white',
    // border: '1px solid',
    borderRadius: '2px',
    // borderColor: Colors.amber50,
    margin: '2px',
    progressBar: {
      color: Colors.amber400,
      backgroundColor: Colors.amber100
    }
  },
  pending: {
    backgroundColor: 'white',
    // border: '1px solid',
    borderRadius: '2px',
    // borderColor: Colors.lightBlue100,
    margin: '2px',
    progressBar: {
      color: Colors.lightBlue400,
      backgroundColor: Colors.lightBlue100
    }
  },
  error: {
    backgroundColor: 'white',
    // border: '1px solid',
    borderRadius: '2px',
    borderColor: Colors.red100,
    margin: '2px',
    progressBar: {
      color: Colors.red400,
      backgroundColor: Colors.red100
    }
  },
  innerDiv: {
    padding: '8px 8px 8px 72px'
  }
}

export default class ElementNotification extends Component {
  static propTypes = {
    // accountName: PropTypes.string.isRequired,
    primaryText: PropTypes.string.isRequired,
    secondaryText: PropTypes.array.isRequired,
    eventType: PropTypes.string.isRequired,
    eventStatus: PropTypes.string.isRequired,
    txHash: PropTypes.string.isRequired,
    networkName: PropTypes.string.isRequired
  }

  static defaultProps = {
    networkName: ''
  }

  etherscanLink = () => {
    const { txHash } = this.props
    return (
      <a
        href={
          'https://' + this.props.networkName + '.etherscan.io/tx/' + txHash
        }
        rel="noopener noreferrer"
        target="_blank"
      />
    )
  }

  transactionMenu = () => {
    const { txHash } = this.props
    const etherScanDisabled = txHash.length === 0 ? true : false
    return (
      <div className={styles.menu}>
        <IconMenu
          desktop={true}
          iconButtonElement={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        >
          <MenuItem
            leftIcon={<Search />}
            primaryText="Etherscan"
            containerElement={this.etherscanLink()}
            disabled={etherScanDisabled}
          />
          {/* <MenuItem primaryText="Receipt" /> */}
        </IconMenu>
      </div>
    )
  }

  render() {
    const { primaryText, secondaryText, eventStatus } = this.props
    const showProgressBar = ['pending', 'authorization']
    return (
      <div style={transactionStyle[eventStatus]}>
        {this.props.networkName ? this.transactionMenu() : null}
        <ListItem
          disabled={true}
          primaryText={primaryText}
          secondaryText={
            <p>
              {secondaryText[0]}
              <br />
              {secondaryText[1]}
            </p>
          }
          leftAvatar={<Avatar src="img/ETH.svg" />}
          secondaryTextLines={2}
          style={transactionStyle.innerDiv}
        />
        <div className={styles.progressBar}>
          {showProgressBar.includes(eventStatus) ? (
            <LinearProgress
              color={transactionStyle[eventStatus].progressBar.color}
              style={transactionStyle[eventStatus].progressBar}
              mode="indeterminate"
            />
          ) : (
            <LinearProgress
              color={transactionStyle[eventStatus].progressBar.color}
              style={transactionStyle[eventStatus].progressBar}
              mode="determinate"
              value={100}
            />
          )}
        </div>
      </div>
    )
  }
}
