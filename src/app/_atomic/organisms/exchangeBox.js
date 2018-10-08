import { Actions } from '../../_redux/actions'
import { Col, Row } from 'react-flexbox-grid'
import { connect } from 'react-redux'
import { getTokenAllowance } from '../../_utils/exchange'
import BigNumber from 'bignumber.js'
import BoxTitle from '../atoms/boxTitle'
import ButtonAuthenticate from '../atoms/buttonAuthenticate'
import ExchangeSelector from '../molecules/exchangeSelector'
// import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import PoolApi from '../../PoolsApi/src'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import SectionTitleExchange from '../atoms/sectionTitleExchange'
import TokensLockBox from '../../_atomic/organisms/tockensLockBox'
import Web3 from 'web3'
import styles from './exchangeBox.module.css'
import utils from '../../_utils/utils'

import { ERC20_TOKENS, RELAYS, TRADE_TOKENS_PAIRS } from '../../_utils/const'

import { CANCEL_SELECTED_ORDER } from '../../_redux/actions/const'

const paperStyle = {
  padding: '10px'
}

function mapStateToProps(state) {
  return state
}

class ExchangeBox extends PureComponent {
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    exchange: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    notifications: PropTypes.object.isRequired
  }

  onSelectExchange = async relay => {
    const { api } = this.context
    const { selectedExchange, selectedFund } = this.props.exchange
    const selectedRelay = RELAYS[relay]
    const availableTradeTokensPair = utils.availableTradeTokensPair(
      TRADE_TOKENS_PAIRS,
      RELAYS[relay].name
    )
    const baseToken =
      ERC20_TOKENS[api._rb.network.name][
        selectedRelay.defaultTokensPair.baseTokenSymbol
      ]
    const quoteToken =
      ERC20_TOKENS[api._rb.network.name][
        selectedRelay.defaultTokensPair.quoteTokenSymbol
      ]
    const allowanceBaseToken = await getTokenAllowance(
      baseToken,
      selectedFund.details.address,
      selectedExchange
    )
    const allowanceQuoteToken = await getTokenAllowance(
      quoteToken,
      selectedFund.details.address,
      selectedExchange
    )
    const tradeTokensPair = {
      baseToken: baseToken,
      quoteToken: quoteToken,
      baseTokenAllowance: new BigNumber(allowanceBaseToken).gt(0),
      quoteTokenAllowance: new BigNumber(allowanceQuoteToken).gt(0),
      ticker: {
        current: {
          price: '0'
        },
        previous: {
          price: '0'
        },
        variation: 0
      }
    }

    // Resetting current order
    this.props.dispatch({
      type: CANCEL_SELECTED_ORDER
    })

    // Updating selected relay
    this.props.dispatch(
      Actions.exchange.updateSelectedRelay(selectedRelay)
    )

    // Updating available tokens pair
    this.props.dispatch(
      Actions.exchange.updateAvailableTradeTokensPairs(availableTradeTokensPair)
    )
    // Updating selected tokens pair
    this.props.dispatch(
      Actions.exchange.updateSelectedTradeTokensPair(tradeTokensPair)
    )
  }

  onAuthEF = async () => {
    const { api } = this.context
    console.log('auth')
    try {
      // var provider = account.source === 'MetaMask' ? window.web3 : api
      const token = Date.now() / 1000 + 3600 + ''
      let web3 = new Web3(window.web3)
      console.log(token)
      let result = await web3.eth.personal.sign(
        token,
        this.props.exchange.walletSelectedAddress
      )
      // .then((result) => {
      //   console.log(result)
      // })
      console.log(result)
      const accountSignature = {
        signature: result,
        nonce: token,
        valid: true
      }
      // Fetch active orders
      this.props.dispatch(
        Actions.exchange.updateAccountSignature(accountSignature)
      )
      // Fetch active orders
      this.props.dispatch(
        Actions.exchange.getAccountOrders(
          this.props.exchange.selectedRelay,
          api._rb.network.id,
          accountSignature,
          this.props.exchange.selectedTokensPair.baseToken,
          this.props.exchange.selectedTokensPair.quoteToken
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  buttonLockClick = async () => {
    console.log(this.props)

    let tokenAddress
    let tokenWrapper
    let isOldERC20
    // ETH
    // tokenAddress = null //Ether has address 0x0
    // tokenWrapper = '0x965808e7f815cfffd4c018ef2ba4c5a65eba087e'

    // GRG
    // const tokenAddress = '0x6FA8590920c5966713b1a86916f7b0419411e474'
    // const tokenWrapper = '0x5959f2036608d693B4d085020ACAdBBf664C793E'

    // USDT
    // const tokenAddress = '0x0736d0c130b2eAD47476cC262dbed90D7C4eeABD'
    // const tokenWrapper = '0x83E42e6d1ac009285376340ef64BaC1C7d106C89'

    // ZRX
    // const tokenAddress = '0xA8E9Fa8f91e5Ae138C74648c9C304F1C75003A8D'
    // const tokenWrapper = '0xFF32E76EAdc11Fc816A727980E92805D237CDB28'
    const toBeWrapped = 1e16 // 10 finney
    const time = 1 // 1 hour lockup (the minimum)

    const exchangeContractAddress = '0x67799a5e640bc64ca24d3e6813842754e546d7b1' // ETX
    // const exchangeContractAddress = '0x8965a813fb43a141d7741320cd16cc1898af97fb' // RigoBlock
    // const exchangeContractAddress = '0x68CE3E415adCF280b5456Ec82142030Af54FDa58'
    const managerAccount = '0xc8dcd42e846466f2d2b89f3c54eba37bf738019b'

    // const { selectedFund } = this.props.exchange.selectedFund

    const poolApi = new PoolApi(window.web3)
    poolApi.contract.drago.init('0x972897D7806769895d258f15d791725Aee0bf688')

    // ETH
    // console.log('ETH Lock')
    // tokenAddress = null //Ether has address 0x0
    // tokenWrapper = '0x965808e7f815cfffd4c018ef2ba4c5a65eba087e'
    // isOldERC20 = false
    // await poolApi.contract.drago.operateOnExchangeEFX(
    //   managerAccount.toLocaleLowerCase(),
    //   exchangeContractAddress.toLocaleLowerCase(),
    //   tokenAddress === null ? null : tokenAddress.toLocaleLowerCase(),
    //   tokenWrapper.toLocaleLowerCase(),
    //   toBeWrapped,
    //   time,
    //   isOldERC20
    // )

    // // GRG
    // console.log('GRG Lock')
    // tokenAddress = '0x6FA8590920c5966713b1a86916f7b0419411e474'
    // tokenWrapper = '0x5959f2036608d693B4d085020ACAdBBf664C793E'
    // isOldERC20 = false
    // await poolApi.contract.drago.operateOnExchangeEFX(
    //   managerAccount.toLocaleLowerCase(),
    //   exchangeContractAddress.toLocaleLowerCase(),
    //   tokenAddress === null ? null : tokenAddress.toLocaleLowerCase(),
    //   tokenWrapper.toLocaleLowerCase(),
    //   toBeWrapped,
    //   time,
    //   isOldERC20
    // )
    // // USDT
    console.log('USDT Lock')
    tokenAddress = '0x0736d0c130b2eAD47476cC262dbed90D7C4eeABD'
    tokenWrapper = '0x83E42e6d1ac009285376340ef64BaC1C7d106C89'
    isOldERC20 = true
    await poolApi.contract.drago.operateOnExchangeEFX(
      managerAccount.toLocaleLowerCase(),
      exchangeContractAddress.toLocaleLowerCase(),
      tokenAddress === null ? null : tokenAddress.toLocaleLowerCase(),
      tokenWrapper.toLocaleLowerCase(),
      toBeWrapped,
      time,
      isOldERC20
    )
    // // ZRX
    // console.log('ZRX Lock')
    // tokenAddress = '0xA8E9Fa8f91e5Ae138C74648c9C304F1C75003A8D'
    // tokenWrapper = '0xFF32E76EAdc11Fc816A727980E92805D237CDB28'
    // isOldERC20 = false
    // await poolApi.contract.drago.operateOnExchangeEFX(
    //   managerAccount.toLocaleLowerCase(),
    //   exchangeContractAddress.toLocaleLowerCase(),
    //   tokenAddress === null ? null : tokenAddress.toLocaleLowerCase(),
    //   tokenWrapper.toLocaleLowerCase(),
    //   toBeWrapped,
    //   time,
    //   isOldERC20
    // )

    // const wethBalance = await baseContracts['WrapperLockEth'].balanceOf(
    //   dragoAddress
    // )
  }

  render() {
    const {
      availableRelays,
      selectedRelay,
      accountSignature,
      selectedFund,
      selectedTokensPair,
      selectedExchange
    } = this.props.exchange
    return (
      <Row>
        <Col xs={12}>
          <Row className={styles.sectionTitle}>
            <Col xs={12}>
              <BoxTitle titleText={'EXCHANGE'} />
              <Paper style={paperStyle} zDepth={1}>
                <Row>
                  <Col xs={12}>
                    <SectionTitleExchange titleText="EXCHANGES" />
                    <ExchangeSelector
                      availableRelays={availableRelays}
                      selectedRelay={selectedRelay.name}
                      onSelectExchange={this.onSelectExchange}
                    />
                  </Col>
                  <Col xs={12}>
                    <div className={styles.section}>
                      <ButtonAuthenticate
                        onAuthEF={this.onAuthEF}
                        disabled={accountSignature.valid}
                      />
                    </div>
                  </Col>
                  <Col xs={12}>
                    <TokensLockBox
                      selectedFund={selectedFund}
                      selectedTokensPair={selectedTokensPair}
                      selectedExchange={selectedExchange}
                      selectedRelay={selectedRelay}
                    />
                  </Col>
                </Row>
              </Paper>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

export default connect(mapStateToProps)(ExchangeBox)
