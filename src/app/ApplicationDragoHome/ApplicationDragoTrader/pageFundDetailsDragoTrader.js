import { Actions } from '../../_redux/actions'
import { Col, Grid, Row } from 'react-flexbox-grid'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { ENDPOINTS, Ethfinex, PROD } from '../../_utils/const'
import { Link, withRouter } from 'react-router-dom'
import { Tab, Tabs } from 'material-ui/Tabs'
import { connect } from 'react-redux'
import { formatCoins, formatEth } from '../../_utils/format'
import ActionAssessment from 'material-ui/svg-icons/action/assessment'
import ActionList from 'material-ui/svg-icons/action/list'
import ActionShowChart from 'material-ui/svg-icons/editor/show-chart'
import AssetsPieChart from '../../_atomic/atoms/assetsPieChart'
import BigNumber from 'bignumber.js'
import CopyContent from 'material-ui/svg-icons/content/content-copy'
import ElementFundActions from '../Elements/elementFundActions'
import ElementFundNotFound from '../../Elements/elementFundNotFound'
import ElementListAssets from '../Elements/elementListAssets'
import ElementListTransactions from '../Elements/elementListTransactions'
import ElementListWrapper from '../../Elements/elementListWrapper'
import ElementPriceBox from '../Elements/elementPricesBox'
import FundHeader from '../../_atomic/molecules/fundHeader'
import InfoTable from '../../Elements/elementInfoTable'
import Loading from '../../_atomic/atoms/loading'
import Paper from 'material-ui/Paper'
import PoolApi from '../../PoolsApi/src'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Search from 'material-ui/svg-icons/action/search'
import SectionHeader from '../../_atomic/atoms/sectionHeader'
import SectionTitle from '../../_atomic/atoms/sectionTitle'
import Snackbar from 'material-ui/Snackbar'
import Sticky from 'react-stickynode'
import Web3 from 'web3'
import scrollToElement from 'scroll-to-element'
import styles from './pageFundDetailsDragoTrader.module.css'
import utils from '../../_utils/utils'
// import { Action } from '../../../node_modules/rxjs/internal/scheduler/Action';

function mapStateToProps(state) {
  return state
}

class PageFundDetailsDragoTrader extends Component {
  // Checking the type of the context variable that we receive by the parent
  static contextTypes = {
    api: PropTypes.object.isRequired
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    endpoint: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    exchange: PropTypes.object.isRequired,
    transactionsDrago: PropTypes.object.isRequired
  }

  state = {
    loading: true,
    snackBar: false,
    snackBarMsg: '',
    openBuySellDialog: {
      open: false,
      action: 'buy'
    }
  }

  componentDidMount = async () => {
    const { api } = this.context
    const relay = {
      name: Ethfinex
    }
    // Getting Drago details
    let dragoDetails = await this.getDragoDetails()

    // Getting Drago assets
    this.props.dispatch(
      Actions.drago.getTokenBalancesDrago(dragoDetails, api, relay)
    )
    const poolApi = new PoolApi(api)
    await poolApi.contract.dragoeventful.init()
    this.subscribeToEvents(poolApi.contract.dragoeventful)
  }

  getDragoDetails = async () => {
    const { api } = this.context
    const relay = {
      name: Ethfinex
    }
    const dragoId = this.props.match.params.dragoid
    const dragoDetails = await utils.getDragoDetailsFromId(dragoId, api)
    await utils.getDragoDetails(dragoDetails, this.props, api, relay)
    this.setState({
      loading: false
    })
    await this.getTransactions(dragoDetails, api, this.props.endpoint.accounts)
    console.log(this.props)
    return dragoDetails
  }

  subscribeToEvents = contract => {
    const networkName = this.props.endpoint.networkInfo.name
    let WsSecureUrl = ''
    const eventfullContracAddress = contract.contract.address[0]
    if (PROD) {
      WsSecureUrl = ENDPOINTS.rigoblock.wss[networkName].prod
    } else {
      WsSecureUrl = ENDPOINTS.rigoblock.wss[networkName].dev
    }
    const web3 = new Web3(WsSecureUrl)
    const eventfullContract = new web3.eth.Contract(
      contract.abi,
      eventfullContracAddress
    )
    const subscription = eventfullContract.events.allEvents(
      {
        fromBlock: 'latest',
        topics: [null, null, null, null]
      },
      (error, events) => {
        if (!error) {
          console.log(`${this.constructor.name} -> New contract event.`)
          console.log(events)
          this.getDragoDetails()
        }
      }
    )
    this.setState({
      contractSubscription: subscription
    })
  }

  componentWillUnmount() {
    const { contractSubscription } = this.state

    this.props.dispatch(Actions.tokens.priceTickersStop())
    this.props.dispatch(Actions.exchange.getPortfolioChartDataStop())
    try {
      contractSubscription.unsubscribe(function(error, success) {
        if (success) {
          console.log(`Successfully unsubscribed from contract.`)
        }
        if (error) {
          console.log(`Unsubscribe error ${error}.`)
        }
      })
    } catch (error) {
      console.log(`Unsubscribe error ${error}.`)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Updating the lists on each new block if the accounts balances have changed
    // Doing this this to improve performances by avoiding useless re-rendering
    //
    const currentBalance = new BigNumber(this.props.endpoint.ethBalance)
    const nextBalance = new BigNumber(nextProps.endpoint.ethBalance)
    if (!currentBalance.eq(nextBalance)) {
      this.getDragoDetails()
      // console.log(`${this.constructor.name} -> UNSAFE_componentWillReceiveProps -> Accounts have changed.`);
    } else {
      null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //
    let stateUpdate = true
    let propsUpdate = true
    // const currentBalance = new BigNumber(this.props.endpoint.ethBalance)
    // const nextBalance = new BigNumber(nextProps.endpoint.ethBalance)
    stateUpdate = !utils.shallowEqual(this.state, nextState)
    propsUpdate = !utils.shallowEqual(this.props, nextProps)
    if (stateUpdate || propsUpdate) {
      // console.log(`${this.constructor.name} -> shouldComponentUpdate -> Proceedding with rendering.`);
    }
    return stateUpdate || propsUpdate
  }

  snackBar = msg => {
    this.setState({
      snackBar: true,
      snackBarMsg: msg
    })
  }

  renderCopyButton = text => {
    if (!text) {
      return null
    }

    return (
      <CopyToClipboard
        text={text}
        key={'address' + text}
        onCopy={() => this.snackBar('Copied to clipboard')}
      >
        <Link to={'#'} key={'addresslink' + text}>
          <CopyContent className={styles.copyAddress} />
        </Link>
      </CopyToClipboard>
    )
  }

  renderEtherscanButton = (type, text) => {
    if (!text) {
      return null
    }

    return (
      <a
        key={'addressether' + text}
        href={this.props.endpoint.networkInfo.etherscan + type + '/' + text}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Search className={styles.copyAddress} />
      </a>
    )
  }

  handlesnackBarRequestClose = () => {
    this.setState({
      snackBar: false,
      snackBarMsg: ''
    })
  }

  handleBuySellButtons = action => {
    this.setState({
      openBuySellDialog: {
        open: !this.state.openBuySellDialog.open,
        action: action
      }
    })
  }

  onTransactionSent = () => {
    this.setState({
      openBuySellDialog: {
        open: false
      }
    })
  }

  render() {
    const {
      endpoint: { accounts: accounts },
      user
    } = this.props
    const { loading } = this.state
    const dragoAssetsList = this.props.transactionsDrago.selectedDrago.assets
    const assetsCharts = this.props.transactionsDrago.selectedDrago.assetsCharts
    const dragoDetails = this.props.transactionsDrago.selectedDrago.details
    const dragoTransactionsList = this.props.transactionsDrago.selectedDrago
      .transactions
    const tabButtons = {
      inkBarStyle: {
        margin: 'auto',
        width: 100,
        backgroundColor: 'white'
      },
      tabItemContainerStyle: {
        margin: 'auto',
        width: 300
      }
    }
    const columnsStyle = [
      styles.detailsTableCell,
      styles.detailsTableCell2,
      styles.detailsTableCell3
    ]
    const columnsStyleLiquidityTable = [
      styles.detailsTableCellLiquidity,
      styles.detailsTableCellLiquidity2,
      styles.detailsTableCellLiquidity3
    ]
    const tableButtonsDragoAddress = [
      this.renderCopyButton(dragoDetails.address),
      this.renderEtherscanButton('address', dragoDetails.address)
    ]
    const tableButtonsDragoOwner = [
      this.renderCopyButton(dragoDetails.addressOwner),
      this.renderEtherscanButton('address', dragoDetails.addressOwner)
    ]
    const tableInfo = [
      ['Created', dragoDetails.created, ''],
      ['Symbol', dragoDetails.symbol, ''],
      ['Name', dragoDetails.name, ''],
      ['Address', dragoDetails.address, tableButtonsDragoAddress],
      ['Manager', dragoDetails.addressOwner, tableButtonsDragoOwner]
    ]
    let portfolioValue = 'N/A'
    let totalValue = 'N/A'
    let assetsValues = {}
    let tableLiquidity = [
      ['Liquidity', 'N/A', ''],
      ['Porfolio value', 'N/A', ''],
      ['Total', 'N/A', '']
    ]
    let estimatedPrice = 'N/A'

    // Waiting until getDragoDetails returns the drago details
    if (loading || Object.keys(dragoDetails).length === 0) {
      return (
        <div style={{ paddingTop: '10px' }}>
          <Loading />
        </div>
      )
    }
    if (dragoDetails.address === '0x0000000000000000000000000000000000000000') {
      return <ElementFundNotFound />
    }
    // console.log(dragoAssetsList)
    if (
      dragoAssetsList.length !== 0 &&
      Object.keys(this.props.exchange.prices).length !== 0
    ) {
      if (typeof dragoDetails.dragoETHBalance !== 'undefined') {
        portfolioValue = utils.calculatePortfolioValue(
          dragoAssetsList,
          this.props.exchange.prices
        )
        totalValue = new BigNumber(dragoDetails.dragoETHBalance)
          .plus(portfolioValue)
          .toFixed(5)
        assetsValues = utils.calculatePieChartPortfolioValue(
          dragoAssetsList,
          this.props.exchange.prices,
          dragoDetails.dragoETHBalance
        )
        tableLiquidity = [
          [
            'Liquidity',
            dragoDetails.dragoETHBalance,
            [<small key="dragoLiqEth">ETH</small>]
          ],
          [
            'Porfolio value',
            portfolioValue,
            [<small key="dragoPortEth">ETH</small>]
          ],
          ['Total', totalValue, [<small key="dragoPortTotEth">ETH</small>]]
        ]
        estimatedPrice = new BigNumber(portfolioValue)
          .div(new BigNumber(dragoDetails.totalSupply))
          .toFixed(5)
      }
    }

    return (
      <Row>
        <Col xs={12}>
          <div className={styles.pageContainer}>
            <Paper zDepth={1}>
              <Sticky enabled={true} innerZ={1}>
                <FundHeader fundType="drago" fundDetails={dragoDetails} />
                <Row className={styles.tabsRow}>
                  <Col xs={12}>
                    <Tabs
                      tabItemContainerStyle={tabButtons.tabItemContainerStyle}
                      inkBarStyle={tabButtons.inkBarStyle}
                    >
                      <Tab
                        label="SUMMARY"
                        className={styles.detailsTab}
                        onActive={() =>
                          scrollToElement('#summary-section', { offset: -165 })
                        }
                        icon={<ActionList color={'#054186'} />}
                      />
                      <Tab
                        label="INSIGHT"
                        className={styles.detailsTab}
                        onActive={() =>
                          scrollToElement('#insight-section', { offset: -165 })
                        }
                        icon={<ActionAssessment color={'#054186'} />}
                      />
                      <Tab
                        label="LOGS"
                        className={styles.detailsTab}
                        onActive={() =>
                          scrollToElement('#transactions-section', {
                            offset: -165
                          })
                        }
                        icon={<ActionShowChart color={'#054186'} />}
                      />
                    </Tabs>
                  </Col>
                </Row>
              </Sticky>
            </Paper>
            <Paper className={styles.paperContainer} zDepth={1}>
              <div className={styles.detailsBoxContainer}>
                <Grid fluid>
                  <Row>
                    <Col xs={12}>
                      <span
                        id="summary-section"
                        ref={section => {
                          this.Summary = section
                        }}
                      />
                      <SectionHeader titleText="SUMMARY" />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <SectionTitle titleText="DETAILS" />
                      <div className={styles.detailsContent}>
                        <div className={styles.sectionParagraph}>
                          Total supply:
                        </div>
                        <div className={styles.holdings}>
                          <span>{dragoDetails.totalSupply}</span>{' '}
                          <small className={styles.myPositionTokenSymbol}>
                            {dragoDetails.symbol.toUpperCase()}
                          </small>
                          <br />
                        </div>
                        <InfoTable
                          rows={tableInfo}
                          columnsStyle={columnsStyle}
                        />
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className={styles.myPositionBox}>
                        <Row>
                          <Col xs={12}>
                            <SectionTitle titleText="POSITION" help={true} />
                            <div className={styles.detailsBoxContainer}>
                              <div className={styles.sectionParagraph}>
                                Your total holding:
                              </div>
                              <div className={styles.holdings}>
                                <span>{dragoDetails.balanceDRG}</span>{' '}
                                <small className={styles.myPositionTokenSymbol}>
                                  {dragoDetails.symbol.toUpperCase()}
                                </small>
                                <br />
                              </div>
                            </div>
                          </Col>
                          <Col xs={12}>
                            <SectionTitle titleText="MARKET" help={true} />
                            <div className={styles.detailsBoxContainer}>
                              <Row>
                                <Col xs={6}>
                                  <div className={styles.sectionParagraph}>
                                    Estimated price:
                                  </div>
                                </Col>
                                <Col xs={6} style={{ textAlign: 'center' }}>
                                  {estimatedPrice} <small>ETH</small>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={12}>
                                  <div
                                    className={styles.sectionParagraph}
                                    style={{ paddingTop: '5px' }}
                                  >
                                    Manager set price:
                                  </div>
                                </Col>
                              </Row>
                              <ElementPriceBox
                                dragoDetails={dragoDetails}
                                accounts={accounts}
                                handleBuySellButtons={this.handleBuySellButtons}
                                isManager={user.isManager}
                              />
                              <ElementFundActions
                                dragoDetails={dragoDetails}
                                accounts={accounts}
                                actionSelected={this.state.openBuySellDialog}
                                onTransactionSent={this.onTransactionSent}
                              />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Grid>
              </div>
            </Paper>
            <Paper className={styles.paperContainer} zDepth={1}>
              <Grid fluid>
                <Row>
                  <Col xs={12}>
                    <span
                      id="insight-section"
                      ref={section => {
                        this.InSight = section
                      }}
                    />
                    <SectionHeader titleText="INSIGHT" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className={styles.detailsBoxContainer}>
                      <div className={styles.detailsSectionContainer}>
                        <SectionTitle titleText="ASSETS" />
                        <Row>
                          <Col xs={12}>
                            <Row>
                              <Col xs={6}>
                                <InfoTable
                                  rows={tableLiquidity}
                                  columnsStyle={columnsStyleLiquidityTable}
                                />
                              </Col>
                              <Col xs={6}>
                                <AssetsPieChart data={assetsValues} />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                      <SectionTitle titleText="PORTFOLIO" />
                      <div className={styles.sectionParagraph}>
                        Assets in porfolio:
                      </div>
                      <ElementListWrapper
                        list={dragoAssetsList}
                        renderCopyButton={this.renderCopyButton}
                        renderEtherscanButton={this.renderEtherscanButton}
                        dragoDetails={dragoDetails}
                        loading={loading}
                        assetsPrices={this.props.exchange.prices}
                        assetsChart={assetsCharts}
                      >
                        <ElementListAssets />
                      </ElementListWrapper>
                    </div>
                  </Col>
                </Row>
              </Grid>
            </Paper>
            <Paper className={styles.paperContainer} zDepth={1}>
              <Grid fluid>
                <Row>
                  <Col xs={12}>
                    <span
                      id="transactions-section"
                      ref={section => {
                        this.Logs = section
                      }}
                    />
                    <SectionHeader titleText="LOGS" />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className={styles.detailsTabContent}>
                    <SectionTitle titleText="TRANSACTIONS" />
                    <div className={styles.detailsTabContent}>
                      <p>Your last 20 transactions on this fund.</p>
                    </div>
                    <ElementListWrapper
                      list={dragoTransactionsList}
                      renderCopyButton={this.renderCopyButton}
                      renderEtherscanButton={this.renderEtherscanButton}
                      loading={loading}
                      pagination={{
                        display: 10,
                        number: 1
                      }}
                    >
                      <ElementListTransactions />
                    </ElementListWrapper>
                  </Col>
                </Row>
              </Grid>
            </Paper>
          </div>
        </Col>
        <Snackbar
          open={this.state.snackBar}
          message={this.state.snackBarMsg}
          action="close"
          onActionClick={this.handlesnackBarRequestClose}
          onRequestClose={this.handlesnackBarRequestClose}
          bodyStyle={{
            height: 'auto',
            flexGrow: 0,
            paddingTop: '10px',
            lineHeight: '20px',
            borderRadius: '2px 2px 0px 0px',
            backgroundColor: '#fafafa',
            boxShadow: '#bdbdbd 0px 0px 5px 0px'
          }}
          contentStyle={{
            color: '#000000 !important',
            fontWeight: '600'
          }}
        />
      </Row>
    )
  }

  // Getting last transactions
  getTransactions = async (dragoDetails, api, accounts) => {
    const dragoAddress = dragoDetails[0][0]

    const poolApi = new PoolApi(this.context.api)
    await poolApi.contract.dragoeventful.init()
    const contract = poolApi.contract.dragoeventful
    const logToEvent = log => {
      const key = api.util.sha3(JSON.stringify(log))
      const {
        blockNumber,
        logIndex,
        transactionHash,
        transactionIndex,
        params,
        type
      } = log
      const ethvalue =
        log.event === 'BuyDrago'
          ? formatEth(params.amount.value, null, api)
          : formatEth(params.revenue.value, null, api)
      const drgvalue =
        log.event === 'SellDrago'
          ? formatCoins(params.amount.value, null, api)
          : formatCoins(params.revenue.value, null, api)
      return {
        type: log.event,
        state: type,
        blockNumber,
        logIndex,
        transactionHash,
        transactionIndex,
        params,
        key,
        ethvalue,
        drgvalue
      }
    }

    // Getting all buyDrago and selDrago events since block 0.
    // dragoFactoryEventsSignatures accesses the contract ABI, gets all the events and for each creates a hex signature
    // to be passed to getAllLogs. Events are indexed and filtered by topics
    // more at: http://solidity.readthedocs.io/en/develop/contracts.html?highlight=event#events

    // The second param of the topics array is the drago address
    // The third param of the topics array is the from address
    // The third param of the topics array is the to address
    //
    //  https://github.com/RigoBlock/Books/blob/master/Solidity_01_Events.MD

    const hexDragoAddress = '0x' + dragoAddress.substr(2).padStart(64, '0')
    const hexAccounts = accounts.map(account => {
      const hexAccount = '0x' + account.address.substr(2).padStart(64, '0')
      return hexAccount
    })
    // const options = {
    //   fromBlock: 0,
    //   toBlock: 'pending',
    // }
    const eventsFilterBuy = {
      topics: [
        [contract.hexSignature.BuyDrago],
        [hexDragoAddress],
        hexAccounts,
        null
      ]
    }
    const eventsFilterSell = {
      topics: [
        [contract.hexSignature.SellDrago],
        [hexDragoAddress],
        hexAccounts,
        null
      ]
    }
    const buyDragoEvents = contract
      .getAllLogs(eventsFilterBuy)
      .then(dragoTransactionsLog => {
        const buyLogs = dragoTransactionsLog.map(logToEvent)
        return buyLogs
      })
    const sellDragoEvents = contract
      .getAllLogs(eventsFilterSell)
      .then(dragoTransactionsLog => {
        const sellLogs = dragoTransactionsLog.map(logToEvent)
        return sellLogs
      })
    Promise.all([buyDragoEvents, sellDragoEvents])
      .then(logs => {
        const allLogs = [...logs[0], ...logs[1]]
        return allLogs
      })
      .then(dragoTransactionsLog => {
        // Creating an array of promises that will be executed to add timestamp to each entry
        // Doing so because for each entry we need to make an async call to the client
        // For additional refernce: https://stackoverflow.com/questions/39452083/using-promise-function-inside-javascript-array-map
        let promises = dragoTransactionsLog.map(log => {
          return api.eth
            .getBlockByNumber(new BigNumber(log.blockNumber).toFixed(0))
            .then(block => {
              log.timestamp = block.timestamp
              return log
            })
            .catch(error => {
              // Sometimes Infura returns null for api.eth.getBlockByNumber, therefore we are assigning a fake timestamp to avoid
              // other issues in the app.
              console.log(error)
              log.timestamp = new Date()
              return log
            })
        })
        Promise.all(promises).then(results => {
          results.sort(function(x, y) {
            return y.timestamp - x.timestamp
          })
          this.props.dispatch(
            Actions.drago.updateSelectedDragoAction({
              transactions: results
            })
          )
          console.log(`${this.constructor.name} -> Transactions list loaded`)
          this.setState({
            loading: false
          })
        })
      })
  }
}
export default withRouter(connect(mapStateToProps)(PageFundDetailsDragoTrader))
