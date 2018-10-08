// import Immutable from 'immutable'
import ContentLoader from 'react-content-loader'
import Pagination from 'material-ui-pagination'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './elementListWrapper.module.css'
import utils from '../_utils/utils'

class ElementListWrapper extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    children: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    pagination: PropTypes.object
  }

  static defaultProps = {
    list: [],
    loading: false,
    pagination: {
      display: 5,
      number: 1
    }
  }

  state = {
    total: Math.ceil(this.props.list.length / 5),
    display: this.props.pagination.display,
    number: this.props.pagination.number,
    loading: true
  }

  td = null

  static getDerivedStateFromProps = (props, state) => {
    if (props.list !== state.list) {
      return {
        total: Math.ceil(props.list.length / state.display)
      }
    }
    return null
  }

  componentDidMount = () => {
    this.td = setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 3000)
  }

  componentWillUnmount = () => {
    clearTimeout(this.td)
  }

  shouldComponentUpdate(nextProps, nextState) {
    let stateUpdate = true
    let propsUpdate = true
    propsUpdate = !utils.shallowEqual(this.props.list, nextProps.list)
    stateUpdate = !utils.shallowEqual(this.state, nextState)
    return stateUpdate || propsUpdate
  }

  render() {
    // Exstracting the list form props
    // and checking if the list === null
    const { list, ...rest } = this.props
    console.log(list)
    if (Object.keys(list).length === 0 && this.state.loading) {
      return (
        <ContentLoader
          height={100}
          width={400}
          speed={2}
          primaryColor="#f3f3f3"
          secondaryColor="#ecebeb"
        >
          <rect x="0" y="10" rx="5" ry="5" width="400" height="10" />
          <rect x="0" y="25" rx="5" ry="5" width="400" height="10" />
          <rect x="0" y="40" rx="5" ry="5" width="400" height="10" />
          <rect x="0" y="55" rx="5" ry="5" width="400" height="10" />
          <rect x="0" y="70" rx="5" ry="5" width="400" height="10" />
          <rect x="0" y="85" rx="5" ry="5" width="400" height="10" />
          <rect x="0" y="100" rx="5" ry="5" width="400" height="10" />
        </ContentLoader>
      )
    }
    const slicedList = list.slice(
      this.state.number * this.state.display - this.state.display,
      this.state.number * this.state.display
    )
    const newProps = { list: slicedList, ...rest }
    return (
      <div>
        <div className={styles.paginatorContainer}>
          <Pagination
            total={this.state.total}
            current={this.state.number}
            display={this.state.display}
            onChange={number => this.setState({ number })}
          />
        </div>
        <div>{React.cloneElement(this.props.children, newProps)}</div>
      </div>
    )
  }
}

export default ElementListWrapper
