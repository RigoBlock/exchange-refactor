// Copyright 2016-2017 Rigo Investment Sagl.

// import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class TestComponent extends Component {
  componentDidMount() {
    console.log('#### MOUNT ####')
  }

  componentWillUnmount() {
    console.log('#### UNMOUNT ####')
  }
  render() {
    return <div>Render</div>
  }
}
