import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TextField from 'material-ui/TextField'

class FilterFunds extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    filterList: PropTypes.func.isRequired
  }

  static defaultProps = {
    list: [],
    filterList: val => val
  }

  filterFunds = (event, newValue) => {
    const { list } = this.props
    const inputValue = newValue.trim().toLowerCase()
    const inputLength = inputValue.length
    const filteredFunds = () => {
      return inputLength === 0
        ? list
        : list.filter(
            item => item.name.toLowerCase().slice(0, inputLength) === inputValue
          )
    }
    this.props.filterList(filteredFunds())
  }

  render() {
    return (
      <TextField
        hintText=""
        floatingLabelText="Search pools"
        floatingLabelFixed={true}
        onChange={this.filterFunds}
        style={{
          width: '100%',
          fontSize: '16px'
        }}
      />
    )
  }
}

export default FilterFunds
