import { Col, Grid, Row } from 'react-flexbox-grid'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import Dialog from 'material-ui/Dialog'
import React, { Component } from 'react'

import { APP, DS } from '../_utils/const'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import SectionHeader from '../_atomic/atoms/sectionHeader'
import SyncStatusCurrentBlock from '../_atomic/atoms/syncStatusCurrentBlock'
import SyncStatusWarpChunksProcessed from '../_atomic/atoms/syncStatusWarpChunksProcessed'
import styles from './elementNotConnected.module.css'

function mapStateToProps(state) {
  return state
}

const style = {
  dialogRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0
  },
  dialogContent: {
    position: 'relative',
    width: '80vw',
    transform: ''
  },
  dialogBody: {
    paddingBottom: 0
  }
}

class ElementNotConnected extends Component {
  static propTypes = {
    app: PropTypes.object.isRequired
  }

  componentDidMount() {
    // this.counter()
  }

  componentWillUnmount() {
    // clearTimeout(td)
  }

  buildUrlPath = () => {
    let path = window.location.hash.split('/')
    // path.splice(-1,1);
    // var url = path.join('/');
    return path[2]
  }

  // counter = () => {
  //   let x = this
  //   let { counter } = this.state;
  //   td = setTimeout(function () {
  //     if (counter > 0) {
  //       x.setState({ counter: counter - 1 })
  //       // console.log('timeout')
  //       x.counter()
  //     } else {
  //       x.setState({ counter: 15 })
  //       // console.log('reset')
  //       x.counter()
  //     }
  //   }, 1000);
  // }

  renderSyncing = () => {
    // const progressWarp = new BigNumber(this.context.syncStatus.warpChunksProcessed).div(new BigNumber(this.context.syncStatus.warpChunksAmount)).times(100).toFixed(2)
    return (
      <Dialog
        open={true}
        modal={true}
        title={this.renderTitle()}
        contentStyle={style.dialogContent}
        bodyStyle={style.dialogBody}
        style={style.dialogRoot}
        repositionOnUpdate={false}
      >
        <div className={styles.detailsBoxContainer}>
          <Grid fluid>
            <Row>
              <Col xs={12}>
                <SectionHeader titleText="NODE SYNCING" />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <p>
                  <b>Your node is syncing with Ethereum blockchain.</b>
                </p>
                <p>
                  Please wait until fully synced before accessing RigoBlock.
                </p>
                <p>Syncing progress:</p>
                <p>
                  <SyncStatusCurrentBlock
                    syncStatus={this.props.app.syncStatus}
                  />
                </p>
                {/* <p><SyncStatusWarpChunksProcessed syncStatus={this.context.syncStatus}/></p> */}
                <p>
                  Please contact our support or{' '}
                  {
                    <Link
                      to={DS + APP + DS + this.buildUrlPath() + DS + 'config'}
                    >
                      select
                    </Link>
                  }{' '}
                  a different endpoint.
                </p>
              </Col>
            </Row>
          </Grid>
        </div>
      </Dialog>
    )
  }

  renderNotConnected = () => {
    return (
      <Dialog
        open={true}
        modal={true}
        title={this.renderTitle()}
        contentStyle={style.dialogContent}
        bodyStyle={style.dialogBody}
        style={style.dialogRoot}
        repositionOnUpdate={false}
      >
        <div className={styles.detailsBoxContainer}>
          <Grid fluid>
            <Row>
              <Col xs={12}>
                <SectionHeader titleText="CONNECTION ERROR" />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <p>
                  <b>Unable to connect to the network.</b>
                </p>
                {/* <p>Trying to establish a new connection in {this.state.counter} seconds... </p> */}
                <p>Trying to establish a new connection... </p>
                {/* <p>
                  Attempt {this.props.app.connectionRetries}: retrying in{' '}
                  {this.props.app.retryTimeInterval}
                  ms
                </p> */}
                <p>Attempt {this.props.app.connectionRetries}.</p>
                <p>
                  Please contact our support or{' '}
                  {
                    <Link
                      to={DS + APP + DS + this.buildUrlPath() + DS + 'config'}
                    >
                      select
                    </Link>
                  }{' '}
                  a different endpoint.
                </p>
              </Col>
            </Row>
          </Grid>
        </div>
      </Dialog>
    )
  }

  renderTitle = () => {
    return null
    // return (
    //   <Row className={styles.modalHeader}>
    //     <Col xs={12}>
    //       <Row className={styles.modalHeaderActions} middle="xs" center="xs">
    //         <Col xs>
    //           <div>
    //             <img src="img/Logo-RigoblockRGB-OUT-01.png" alt="logo" />
    //           </div>
    //         </Col>
    //       </Row>
    //     </Col>
    //   </Row>
    // )
  }

  render() {
    const { isSyncing } = this.props.app
    // console.log('Sync Status: ', syncStatus)
    // console.log('Syncing: ', isSyncing)
    return isSyncing ? this.renderSyncing() : this.renderNotConnected()
  }
}

export default connect(mapStateToProps)(ElementNotConnected)
