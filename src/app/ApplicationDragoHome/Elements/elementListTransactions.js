import {
  AutoSizer,
  Column,
  SortDirection,
  SortIndicator,
  Table
} from 'react-virtualized'
import { Col, Row } from 'react-flexbox-grid'
import { Link, withRouter } from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import utils from '../../_utils/utils'

import styles from './elementListTransactions.module.css'

import * as Colors from 'material-ui/styles/colors'
import BigNumber from 'bignumber.js'

// const list = Immutable.List(generateRandomList());

class ElementListTransactions extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    renderCopyButton: PropTypes.func.isRequired,
    renderEtherscanButton: PropTypes.func.isRequired
  }

  constructor(props, context) {
    super(props, context)
    const { list } = this.props
    const sortDirection = SortDirection.ASC
    const sortedList = list
    const rowCount = list.length

    this.state = {
      disableHeader: false,
      headerHeight: 30,
      height: 500,
      width: 600,
      hideIndexRow: false,
      overscanRowCount: 10,
      rowHeight: 40,
      rowCount: rowCount,
      scrollToIndex: undefined,
      sortDirection,
      sortedList,
      useDynamicRowHeight: false
    }

    this._getRowHeight = this._getRowHeight.bind(this)
    this._headerRenderer = this._headerRenderer.bind(this)
    this._noRowsRenderer = this._noRowsRenderer.bind(this)
    this._onRowCountChange = this._onRowCountChange.bind(this)
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this)
    this._rowClassName = this._rowClassName.bind(this)
    this._sort = this._sort.bind(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { list } = nextProps
    const sortedList = list
    const rowCount = list.length
    this.setState({
      sortedList: sortedList,
      rowCount: rowCount
    })

    // console.log(`${this.constructor.name} -> UNSAFE_componentWillReceiveProps`);
  }

  render() {
    const {
      disableHeader,
      headerHeight,
      height,
      overscanRowCount,
      rowHeight,
      rowCount,
      scrollToIndex,
      sortBy,
      sortDirection,
      sortedList,
      useDynamicRowHeight
    } = this.state

    const rowGetter = ({ index }) => this._getDatum(sortedList, index)

    return (
      <Row>
        <Col xs={12}>
          <div style={{ flex: '1 1 auto' }}>
            <AutoSizer disableHeight>
              {({ width }) => (
                <Table
                  id={'transactions-table'}
                  disableHeader={disableHeader}
                  headerClassName={styles.headerColumn}
                  headerHeight={headerHeight}
                  height={height}
                  noRowsRenderer={this._noRowsRenderer}
                  overscanRowCount={overscanRowCount}
                  rowClassName={this._rowClassName}
                  rowHeight={
                    useDynamicRowHeight ? this._getRowHeight : rowHeight
                  }
                  rowGetter={rowGetter}
                  rowCount={rowCount}
                  scrollToIndex={scrollToIndex}
                  sort={this._sort}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                  width={width}
                >
                  {/* <Column
                    width={100}
                    disableSort
                    label="Blocknumber"
                    cellDataGetter={({rowData}) => rowData.blockNumber.c[0]}
                    dataKey="blocknumber"
                    className={styles.exampleColumn}
                    cellRenderer={({cellData}) => cellData}
                  />  */}
                  <Column
                    width={200}
                    disableSort
                    label="DATE"
                    cellDataGetter={({ rowData }) => rowData.timestamp}
                    dataKey="date"
                    className={styles.exampleColumn}
                    cellRenderer={({ cellData }) => this.renderTime(cellData)}
                    flexShrink={1}
                  />
                  <Column
                    width={100}
                    disableSort
                    label="TRADE"
                    cellDataGetter={({ rowData }) => rowData.type}
                    dataKey="action"
                    className={styles.exampleColumn}
                    cellRenderer={({ cellData }) => this.renderAction(cellData)}
                    flexShrink={1}
                  />
                  {/* <Column
                    width={100}
                    disableSort
                    label="SYMBOL"
                    cellDataGetter={({rowData}) => rowData}
                    dataKey="symbol"
                    cellRenderer={({cellData}) => this.renderSymbol(cellData)}
                    className={styles.exampleColumn}
                    flexShrink={1}
                  /> */}
                  {/* formatEth(price) }<small> ETH</small> */}
                  <Column
                    width={100}
                    disableSort
                    label="UNITS"
                    cellDataGetter={({ rowData }) => rowData.drgvalue}
                    dataKey="drg"
                    className={styles.exampleColumn}
                    cellRenderer={({ rowData }) => this.renderDrgValue(rowData)}
                    flexShrink={1}
                  />
                  <Column
                    width={100}
                    disableSort
                    label="VALUE"
                    cellDataGetter={({ rowData }) => rowData.ethvalue}
                    dataKey="eth"
                    className={styles.exampleColumn}
                    cellRenderer={({ rowData }) =>
                      this.renderEthValue(rowData.ethvalue)
                    }
                    flexShrink={1}
                  />
                  <Column
                    width={210}
                    disableSort
                    label="TX"
                    cellDataGetter={({ rowData }) => rowData.transactionHash}
                    dataKey="tx"
                    className={styles.exampleColumn}
                    cellRenderer={({ rowData }) =>
                      this.renderTx(rowData.transactionHash)
                    }
                    flexGrow={1}
                  />
                  {/* <Column
                    width={210}
                    disableSort
                    label="Actions"
                    cellDataGetter={({rowData}) => rowData.transactionHash}
                    dataKey="actions"
                    className={styles.exampleColumn}
                    cellRenderer={({cellData}) => cellData}
                    cellRenderer={({cellData, rowData}) => this.actionButton(cellData, rowData)}
                    flexShrink={1}
                  /> */}
                </Table>
              )}
            </AutoSizer>
          </div>
        </Col>
      </Row>
    )
  }

  actionButton(cellData, rowData) {
    const { match } = this.props
    const url =
      rowData.params.dragoId.value.c +
      '/' +
      utils.dragoISIN(cellData, rowData.params.dragoId.value.c)
    return (
      <FlatButton
        label="View"
        primary={true}
        containerElement={<Link to={match.path + '/' + url} />}
      />
    )
  }

  renderSymbol(input) {
    return <div>{input.symbol.toUpperCase()}</div>
  }

  renderEthValue(ethValue) {
    return (
      <div>
        {new BigNumber(ethValue).toFixed(4)} <small>ETH</small>
      </div>
    )
  }

  renderTx(transactionHash) {
    return (
      <span>
        {this.props.renderCopyButton(transactionHash)}{' '}
        {this.props.renderEtherscanButton('tx', transactionHash)}
      </span>
    )
  }

  renderAction(action) {
    switch (action) {
      case 'BuyDrago':
        return (
          <span style={{ color: Colors.green300, fontWeight: 600 }}>BUY</span>
        )
      case 'SellDrago':
        return (
          <span style={{ color: Colors.red300, fontWeight: 600 }}>SELL</span>
        )
      case 'DragoCreated':
        return (
          <span style={{ color: Colors.blue300, fontWeight: 600 }}>
            CREATED
          </span>
        )
    }
  }

  renderTime(timestamp) {
    return <span>{utils.dateFromTimeStamp(timestamp)}</span>
  }

  renderDrgValue(rowData) {
    return (
      <div>
        {new BigNumber(rowData.drgvalue).toFixed(4)}{' '}
        <small>{rowData.symbol}</small>
      </div>
    )
  }

  _getDatum(list, index) {
    return list[index]
  }

  _getRowHeight({ index }) {
    const { list } = this.state
    return this._getDatum(list, index).length
  }

  _headerRenderer({ dataKey, sortBy, sortDirection }) {
    return (
      <div>
        Full Name
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    )
  }

  _isSortEnabled() {
    const { list } = this.props
    const { rowCount } = this.state

    return rowCount <= list.size
  }

  _noRowsRenderer() {
    return <div className={styles.noRows}>No rows</div>
  }

  _onRowCountChange(event) {
    const rowCount = parseInt(event.target.value, 10) || 0

    this.setState({ rowCount })
  }

  _onScrollToRowChange(event) {
    const { rowCount } = this.state
    let scrollToIndex = Math.min(rowCount - 1, parseInt(event.target.value, 10))

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined
    }

    this.setState({ scrollToIndex })
  }

  _rowClassName({ index }) {
    if (index < 0) {
      return styles.headerRow
    } else {
      return index % 2 === 0 ? styles.evenRow : styles.oddRow
    }
  }

  _sort({ sortBy, sortDirection }) {
    const sortedList = this._sortList({ sortBy, sortDirection })

    this.setState({ sortBy, sortDirection, sortedList })
  }

  _sortList({ sortBy, sortDirection }) {
    const { list } = this.props
    return list
      .sortBy(item => item.timestamp)
      .update(
        list => (sortDirection === SortDirection.DESC ? list : list.reverse())
      )
  }

  _updateUseDynamicRowHeight(value) {
    this.setState({
      useDynamicRowHeight: value
    })
  }
}

export default withRouter(ElementListTransactions)
