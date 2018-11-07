import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'

configure({ adapter: new Adapter() })

global.createComponentWithProps = (Component, props) => <Component {...props} />
global.createComponentWithProps.displayName = 'testComponent'
