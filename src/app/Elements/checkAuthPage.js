import { APP, DS } from '../_utils/const.js'
import { Col, Row } from 'react-flexbox-grid'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import Avatar from 'material-ui/Avatar'
import Dialog from 'material-ui/Dialog'
import ListItem from 'material-ui/List/ListItem'
import NetworkAlert from './elementNetworkAlert'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import WalletSetupStepper from '../_atomic/organisms/walletSetupStepper'
import styles from './checkAuthPage.module.css'

class CheckAuthPage extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    counter: 15
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    warnMsg: PropTypes.string
  }

  static defaultProps = {
    warnMsg: ''
  }

  renderWarnMsg = () => {
    const { warnMsg } = this.props
    if (warnMsg === '') return
    return <NetworkAlert />
  }

  buildUrlPath = location => {
    let path = location.pathname.split('/')
    // path.splice(-1,1);
    // var url = path.join('/');
    return path[2]
  }

  render() {
    // console.log(this.props)
    const { location } = this.props
    return (
      <Row>
        <Col xs={12}>
          <Dialog
            title="Wallet setup"
            modal={false}
            open={true}
            onRequestClose={this.handleClose}
            repositionOnUpdate={false}
          >
            <WalletSetupStepper />
          </Dialog>
        </Col>
        <Col xs={12}>
          <Paper className={styles.paperContainer} zDepth={1}>
            {this.renderWarnMsg()}
            <Row>
              <Col xs={12}>
                <div className={styles.mainlogo}>
                  <img
                    style={{ height: '80px' }}
                    src="/img/Logo-RigoblockRGB-OUT-01.png"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} className={styles.walletBox}>
                <h2>NETWORK</h2>
                <p>
                  You can change the Ethereum network endpoint an Network in the{' '}
                  <Link
                    to={
                      DS +
                      APP +
                      DS +
                      this.buildUrlPath(location) +
                      DS +
                      'config/network'
                    }
                  >
                    network configuration
                  </Link>{' '}
                  page.
                </p>
                <h2>ACCOUNTS</h2>
                <p>
                  You need to connect to an external wallet. Please{' '}
                  <b>unlock</b> your MetaMask account and <b>refresh</b> your
                  browser.
                </p>
                <p>
                  If you do not have MetaMask installed, please read the
                  instruction below.
                </p>
                <p>RigoBlock supports Metamask and Parity wallets.</p>
                <ListItem
                  className={styles.walletTitle}
                  disabled={true}
                  size={50}
                  leftAvatar={<Avatar src="img/metamask.png" />}
                >
                  MetaMask
                </ListItem>
                <p>
                  MetaMask is a Chrome and Firefox extension that enables you to
                  navigate Ethereum compatible websites and access blockchain
                  decentralized application.
                </p>
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn how to install MetaMask
                </a>
              </Col>
              <Col xs={12} className={styles.walletBox}>
                <ListItem
                  className={styles.walletTitle}
                  disabled={true}
                  size={50}
                  leftAvatar={<Avatar src="img/14176906.png" />}
                >
                  Parity
                </ListItem>
                <p>
                  RigoBlock is also available as a Ðapp inside the Parity client
                </p>
                <p>
                  Parity comes with an extensive, easy-to-use, in-built Ethereum
                  Wallet and Ðapp environment that can be accessed via your Web
                  browser of choice.
                </p>
                <a
                  href="https://www.parity.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn how to install Parity
                </a>
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
    )
  }
}

export default withRouter(CheckAuthPage)
