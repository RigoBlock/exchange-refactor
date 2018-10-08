import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class InfoTable extends Component {
  static propTypes = {
    rows: PropTypes.array,
    tableHeader: PropTypes.array,
    columnsStyle: PropTypes.array,
    tableStyle: PropTypes.string
  }

  compactStyle = {
    height: '20px',
    padding: '8px'
  }

  renderColumn = row => {
    const { columnsStyle } = this.props
    return row.map((cell, index) => {
      const key = 'infoTableCol' + index
      const rowCell =
        index == 0 ? (
          <TableRowColumn
            className={columnsStyle[index]}
            style={this.compactStyle}
            key={key}
          >
            {cell}
          </TableRowColumn>
        ) : (
          <TableRowColumn
            className={columnsStyle[index]}
            style={this.compactStyle}
            key={key}
          >
            {cell}
          </TableRowColumn>
        )
      return rowCell
    })
  }

  renderRow = rows => {
    return rows.map((row, index) => {
      return (
        <TableRow
          hoverable={false}
          key={'infoTableRow' + index}
          style={this.compactStyle}
        >
          {this.renderColumn(row)}
        </TableRow>
      )
    })
  }

  render() {
    const { rows } = this.props
    return (
      <Table selectable={false}>
        <TableBody displayRowCheckbox={false}>{this.renderRow(rows)}</TableBody>
      </Table>
    )
  }
}
