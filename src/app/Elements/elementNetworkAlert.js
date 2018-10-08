import { APP, DS } from '../_utils/const'
import { Col, Grid, Row } from 'react-flexbox-grid'
import { Link } from 'react-router-dom'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import React, { Component } from 'react'
import SectionHeader from '../_atomic/atoms/sectionHeader'
import styles from './elementNotConnected.module.css'

// Workaround:
// https://github.com/mui-org/material-ui/issues/1676#issuecomment-236621533
//

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

class NetworkAlert extends Component {
  state = {
    open: true
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  buildUrlPath = () => {
    let path = window.location.hash.split('/')
    // path.splice(-1,1);
    // var url = path.join('/');
    return path[2]
  }

  renderTitle = () => {
    return (
      <Row className={styles.modalHeader}>
        <Col xs={12}>
          <Row className={styles.modalHeaderActions} middle="xs" center="xs">
            <Col xs>
              <img src="img/Logo-RigoblockRGB-OUT-01.png" alt="logo" />
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }

  render() {
    const actions = [
      <FlatButton
        key="close"
        label="Close"
        primary={true}
        onClick={this.handleClose}
      />
    ]
    return (
      <Dialog
        actions={actions}
        open={this.state.open}
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
                <SectionHeader titleText="NETWORK ERROR" />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <p>
                  We have detected that your MetaMask is not connected to the
                  correct network.
                </p>
                <p>
                  Please verify that the network selected in the{' '}
                  {
                    <Link
                      to={DS + APP + DS + this.buildUrlPath() + DS + 'config'}
                    >
                      config
                    </Link>
                  }{' '}
                  page matches with your MetaMask settings.
                </p>
              </Col>
            </Row>
          </Grid>
        </div>
      </Dialog>
    )
  }
}

export default NetworkAlert
