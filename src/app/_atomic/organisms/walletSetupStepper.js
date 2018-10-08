import { ERC20_TOKENS } from '../../_utils/tokens'
import { Step, StepContent, StepLabel, Stepper } from 'material-ui/Stepper'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Looks3 from 'material-ui/svg-icons/image/looks-3'
import Looks4 from 'material-ui/svg-icons/image/looks-4'
import LooksOne from 'material-ui/svg-icons/image/looks-one'
import LooksTwo from 'material-ui/svg-icons/image/looks-two'
import PoolApi from '../../PoolsApi/src'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import React, { Component } from 'react'
import SectionHeader from '../atoms/sectionHeader'
import styles from './walletSetupStepper.module.css'

function mapStateToProps(state) {
  return state
}

class WalletSetupStepper extends Component {
  static propTypes = {
    endpoint: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
  }
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  state = {
    open: false,
    locked: this.props.endpoint.isMetaMaskLocked,
    correctNetwork: this.props.endpoint.isMetaMaskNetworkCorrect,
    holdsTokens: this.props.endpoint.grgBalance.eq(0),
    finished: false,
    errorMsg: '',
    steps: [
      {
        index: 0,
        success: false,
        successIcon: '',
        errorIcon: '',
        labelIcon: {}
      },
      {
        index: 1,
        success: false,
        successIcon: '',
        errorIcon: ''
      },
      {
        index: 2,
        success: false,
        successIcon: '',
        errorIcon: ''
      },
      {
        index: 3,
        success: false,
        successIcon: '',
        errorIcon: ''
      }
    ],
    stepIndex: 0,
    done: false
  }

  static getDerivedStateFromProps(props, state) {
    const locked = props.endpoint.isMetaMaskLocked
    const correctNetwork = props.endpoint.isMetaMaskNetworkCorrect
    const holdsTokens = !props.endpoint.grgBalance.eq(0)
    console.log(props.endpoint.grgBalance)
    console.log(holdsTokens)
    if (locked !== state.locked) {
      return {
        locked: locked,
        correctNetwork: correctNetwork,
        holdsTokens: holdsTokens
      }
    } else {
      return {
        holdsTokens: holdsTokens
      }
    }
  }

  handleNext = () => {
    const { stepIndex } = this.state
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2
    })
  }

  handlePrev = () => {
    const { stepIndex } = this.state
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 })
    }
  }

  handleFinish = () => {
    this.setState({ stepIndex: 0 })
    this.props.handleClose()
  }

  getGRGFromFaucet = async () => {
    const { api } = this.context
    const faucetAddress = ERC20_TOKENS[api._rb.network.name].GRG.faucetAddress
    const accounts = await window.web3.eth.getAccounts()
    const poolApi = new PoolApi(window.web3)
    await poolApi.contract.rigotokenfaucet.init(faucetAddress)
    try {
      await poolApi.contract.rigotokenfaucet.drip1Token(accounts[0])
    } catch (error) {
      console.log(error)
      this.setState({ errorMsg: 'You can request 0.5 tokens every 48 hours.' })
    }
  }

  renderStepActions(step) {
    const { stepIndex } = this.state
    const { locked, correctNetwork, holdsTokens } = this.state
    const buttonDisable = () => {
      switch (step) {
        case 0:
          return locked
        case 1:
          return !correctNetwork || locked
        case 2:
          return !correctNetwork || locked || !holdsTokens
        case 3:
          return !correctNetwork || locked || !holdsTokens
      }
    }
    return (
      <div style={{ margin: '12px 0' }}>
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onClick={this.handlePrev}
            style={{ marginRight: 12 }}
          />
        )}

        {step >= 0 &&
          step < 3 &&
          step !== 2 && (
            <RaisedButton
              label={'Next'}
              disabled={buttonDisable(step)}
              disableTouchRipple={true}
              disableFocusRipple={true}
              primary={true}
              onClick={this.handleNext}
              style={{ marginRight: 12 }}
            />
          )}
        {step === 2 &&
          !holdsTokens && (
            <RaisedButton
              label={'Get GRG'}
              disableTouchRipple={true}
              disableFocusRipple={true}
              primary={true}
              onClick={this.getGRGFromFaucet}
              style={{ marginRight: 12 }}
            />
          )}

        {step === 2 &&
          holdsTokens && (
            <RaisedButton
              label={'Next'}
              disabled={buttonDisable(step)}
              disableTouchRipple={true}
              disableFocusRipple={true}
              primary={true}
              onClick={this.handleNext}
              style={{ marginRight: 12 }}
            />
          )}

        {step === 3 && (
          <RaisedButton
            label={'Go'}
            disabled={buttonDisable(step)}
            disableTouchRipple={true}
            disableFocusRipple={true}
            primary={true}
            onClick={this.handleFinish}
            style={{ marginRight: 12 }}
          />
        )}
      </div>
    )
  }

  setActive = step => {
    // console.log(step)
    // console.log(this.state.stepIndex === this.state.steps[step].index ? styles.activeStep : styles.notActiveStep)
    if (this.state.stepIndex === this.state.steps[step].index) {
      return {
        active: true,
        labelClass: styles.activeStep,
        iconStyle: {
          container: {
            marginLeft: '-5px',
            paddingTop: '5px'
          },
          height: '34px',
          width: '34px'
        }
      }
    } else {
      return {
        active: false,
        labelClass: styles.notActiveStep,
        iconStyle: {
          opacity: '0.6'
        }
      }
    }
  }

  renderIcon = (style, number) => {
    const lockedColor = this.state.locked ? '#FF9800' : '#4CAF50'
    const networkColor = !this.state.correctNetwork ? '#FF9800' : '#4CAF50'
    const tokenColor = !this.state.holdsTokens ? '#FF9800' : '#4CAF50'
    switch (number) {
      case 0:
        return (
          <div style={style.container}>
            <LooksOne style={style} color={lockedColor} />
          </div>
        )
      case 1:
        return (
          <div style={style.container}>
            <LooksTwo style={style} color={networkColor} />
          </div>
        )
      case 2:
        return (
          <div style={style.container}>
            <Looks3 style={style} color={tokenColor} />
          </div>
        )
      case 3:
        return (
          <div style={style.container}>
            <Looks4 style={style} color="#054186" />
          </div>
        )
    }
  }

  render() {
    const { stepIndex } = this.state
    const { locked, correctNetwork, holdsTokens } = this.state
    const { networkInfo } = this.props.endpoint
    // console.log(this.props.app)
    // console.log(this.setActive(0).iconStyle)
    return (
      <Dialog
        title={
          <SectionHeader
            textStyle={{
              fontSize: '32px',
              fontWeight: 700,
              textAlign: 'center',
              borderRadius: '0px'
            }}
            containerStyle={{ marginLeft: '0px', marginRight: '0px' }}
            titleText="WALLET SETUP"
          />
        }
        modal={true}
        open={this.props.open}
        onRequestClose={this.handleFinish}
        repositionOnUpdate={false}
        // contentStyle={{ minHeight: 900 }}
      >
        <div style={{ maxWidth: 380, minHeight: 400, margin: 'auto' }}>
          <Stepper activeStep={stepIndex} orientation="vertical">
            <Step className={this.setActive(0).labelClass}>
              <StepLabel icon={this.renderIcon(this.setActive(0).iconStyle, 0)}>
                <span className={styles.titleStep}>Unlock your wallet</span>
              </StepLabel>
              <StepContent>
                <p>
                  Please make sure that your wallet is unlocked and the correct
                  account selected.
                </p>
                {!locked && (
                  <p>
                    Everything is <b>fine</b>, your wallet is{' '}
                    <span className={styles.unlockedText}>unlocked</span>.
                  </p>
                )}
                {locked && (
                  <p>
                    We have detected that your wallet is{' '}
                    <span className={styles.lockedText}>locked</span>.
                  </p>
                )}

                <a
                  href="https://help.rigoblock.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  I need help to set up a wallet!
                </a>
                {this.renderStepActions(0)}
              </StepContent>
            </Step>
            <Step className={this.setActive(1).labelClass}>
              <StepLabel icon={this.renderIcon(this.setActive(1).iconStyle, 1)}>
                <span className={styles.titleStep}>Select a network</span>
              </StepLabel>
              <StepContent>
                {/* <p>
                You need to connect your wallet to <b>Rospen</b> Ethereum
                testnet.
              </p>
              <p>
                RigoBlock also supports Kovan and you will be once finished this
                setup.
              </p> */}
                {correctNetwork && (
                  <div>
                    <p>
                      You are connected to{' '}
                      <b>
                        {networkInfo.name.charAt(0).toUpperCase() +
                          networkInfo.name.slice(1)}
                      </b>{' '}
                      network.
                    </p>
                    <p>Please proceed to the next step.</p>
                  </div>
                )}
                {!correctNetwork && (
                  <div>
                    <p>
                      We have detected that you are <b>not</b> connected to{' '}
                      <b>{this.props.endpoint.networkInfo.name}</b> network.
                    </p>
                    <p>Please configure your wallet accordingly.</p>
                  </div>
                )}
                <a
                  href="https://help.rigoblock.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tell me more about this.
                </a>
                {this.renderStepActions(1)}
              </StepContent>
            </Step>
            <Step className={this.setActive(2).labelClass}>
              <StepLabel icon={this.renderIcon(this.setActive(2).iconStyle, 2)}>
                <span className={styles.titleStep}>Get GRG tokens</span>
              </StepLabel>
              <StepContent>
                {holdsTokens && (
                  <div>
                    <p>
                      Great, you hold the minimum GRG amount to access our
                      platform!
                    </p>
                  </div>
                )}
                {!holdsTokens && (
                  <div>
                    <p>
                      You need at least 0.5 GRG tokens to access our platform.
                      Get some by clicking the button below!
                    </p>
                  </div>
                )}
                {this.renderStepActions(2)}
                <div className={styles.errorMsg}>{this.state.errorMsg}</div>
              </StepContent>
            </Step>
            <Step className={this.setActive(3).labelClass}>
              <StepLabel icon={this.renderIcon(this.setActive(3).iconStyle, 3)}>
                <span className={styles.titleStep}>Done!</span>
              </StepLabel>
              <StepContent>
                <p>You are all set.</p>
                {this.renderStepActions(3)}
              </StepContent>
            </Step>
          </Stepper>
        </div>
      </Dialog>
    )
  }
}

export default connect(mapStateToProps)(WalletSetupStepper)
