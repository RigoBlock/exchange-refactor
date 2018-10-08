// Copyright 2016-2017 Rigo Investment Sagl.

import { Card, CardActions, CardText, CardTitle } from 'material-ui/Card'
import { Col, Row } from 'react-flexbox-grid'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Chat from 'material-ui/svg-icons/communication/chat'
import ElementBottomStatusBar from '../Elements/elementBottomStatusBar'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import React, { Component } from 'react'
import WalletSetup from '../_atomic/organisms/walletSetup'
import styles from './applicationHome.module.css'

function mapStateToProps(state) {
  return state
}

class ApplicationHome extends Component {
  // We check the type of the context variable that we receive by the parent
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    endpoint: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  render() {
    const { endpoint } = this.props
    const buttonTelegram = {
      border: '2px solid',
      borderColor: '#054186',
      fontWeight: '600',
      height: '45px'
      // width: "140px"
    }

    console.log(this.props)
    return (
      <div className={styles.body}>
        <Row>
          <Col xs={12}>
            <div className={styles.shadow}>
              <Row>
                <Col xs={12}>
                  <div className={styles.mainlogo}>
                    <img
                      style={{ height: '80px' }}
                      src="/img/Logo-RigoblockRGB-OUT-01.png"
                    />
                  </div>
                  <h2 className={styles.headline}>
                    Decentralized Pools of Digital Tokens
                  </h2>
                  <div className={styles.telegramButtonContainer}>
                    <a
                      href="https://t.me/rigoblockprotocol"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.communityButton}
                    >
                      <FlatButton
                        labelPosition="before"
                        label="Join us on telegram!"
                        labelStyle={{
                          color: '#054186',
                          fontWeight: '600',
                          fontSize: '20px'
                        }}
                        style={buttonTelegram}
                        icon={
                          <img
                            src="/img/iconmonstr-telegram-1.svg"
                            // style={{ fill: '#ffca57' }}
                            height="24px"
                            className={styles.telegramIcon}
                          />
                        }
                        // hoverColor={Colors.blue300}
                      />
                    </a>

                    <a
                      href="https://community.rigoblock.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.communityButton}
                    >
                      <FlatButton
                        labelPosition="before"
                        label="Join our Community"
                        labelStyle={{
                          color: '#054186',
                          fontWeight: '600',
                          fontSize: '20px'
                        }}
                        style={buttonTelegram}
                        icon={<Chat color="#ffca57" />}
                        // hoverColor={Colors.blue300}
                      />
                    </a>
                  </div>

                  <p className={styles.subHeadline}>
                    We aim to create a new generation of traders and a new level
                    of asset management system. Simple, transparent,
                    meritocratic and democratic.
                  </p>
                </Col>
              </Row>
              <Row className={styles.cards}>
                <Col xs={6}>
                  <Card className={styles.column}>
                    <CardTitle
                      title="VAULT"
                      className={styles.cardtitle}
                      titleColor="white"
                    />
                    <CardText>
                      <p className={styles.subHeadline}>
                        Pools of ether and proof-of-stake mining
                      </p>
                    </CardText>
                    <CardActions>
                      <Link to="/vault">
                        <RaisedButton
                          label="New Vault"
                          className={styles.exchangebutton}
                          labelColor="white"
                        />
                      </Link>
                    </CardActions>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card className={styles.column}>
                    <CardTitle
                      title="DRAGO"
                      className={styles.cardtitle}
                      titleColor="white"
                    />
                    <CardText>
                      <p className={styles.subHeadline}>
                        Pools of ether and trading on decentralized exchanges
                      </p>
                    </CardText>
                    <CardActions>
                      {/* <ApplicationDragoFactory /> */}
                      <Link to="/drago">
                        <RaisedButton
                          label="New Drago"
                          className={styles.exchangebutton}
                          labelColor="white"
                        />
                      </Link>
                    </CardActions>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <p />
                </Col>
              </Row>
              <Row>
                <Col xs={12} className={styles.socialsContainer}>
                  <a
                    href="https://t.me/rigoblockprotocol"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/img/social/telegram.svg" height="32px" />
                  </a>
                  <a
                    href="https://discordapp.com/channels/rigoblock"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/img/social/discord.svg" height="32px" />
                  </a>
                  <a
                    href="https://www.facebook.com/RigoBlocks"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/img/social/facebook.svg" height="32px" />
                  </a>
                  <a
                    href="https://twitter.com/rigoblock"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/img/social/twitter.svg" height="32px" />
                  </a>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={12}>
            <ElementBottomStatusBar
              blockNumber={endpoint.prevBlockNumber}
              networkName={endpoint.networkInfo.name}
              networkError={endpoint.networkError}
              networkStatus={endpoint.networkStatus}
            />
          </Col>
        </Row>
        <WalletSetup />
      </div>
    )
  }
}

export default withRouter(connect(mapStateToProps)(ApplicationHome))
