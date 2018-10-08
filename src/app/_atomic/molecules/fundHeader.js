import * as Colors from 'material-ui/styles/colors'
import { Col, Row } from 'react-flexbox-grid'
import { THEME_COLOR } from './../../_utils/const'
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar'
import FundHeaderNameSymbol from '../atoms/fundHeaderNameSymbol'
import IdentityIcon from '../atoms/identityIcon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './fundHeader.module.css'

export default class FundHeader extends Component {
  static propTypes = {
    fundDetails: PropTypes.object.isRequired,
    actions: PropTypes.object,
    fundType: PropTypes.string.isRequired
  }

  static defaultProps = {
    fundType: 'drago',
    actions: <noscript />
  }

  render() {
    const headerStyle = {
      drago: {
        toolBar: {
          background: THEME_COLOR.drago
        }
      },
      vault: {
        toolBar: {
          background: THEME_COLOR.vault
        }
      }
    }

    const { fundDetails, fundType } = this.props
    if (!fundDetails.address) {
      return <p>empty</p>
    }
    return (
      <Toolbar
        className={styles.detailsToolbar}
        style={headerStyle[fundType].toolBar}
      >
        {this.props.actions ? (
          <div className={styles.managerButtonContainer}>
            {this.props.actions}
          </div>
        ) : null}
        <ToolbarGroup className={styles.detailsToolbarGroup}>
          <Row className={styles.detailsToolbarGroup}>
            <div className={styles.identityIconContainer}>
              <IdentityIcon
                address={fundDetails.address}
                size={'60px'}
                customStyle={{
                  borderStyle: 'solid',
                  borderColor: Colors.grey400
                }}
              />
            </div>
            <Col xs={12} className={styles.dragoTitle}>
              <FundHeaderNameSymbol
                fundDetails={fundDetails}
                fundType={fundType}
              />
            </Col>
          </Row>
        </ToolbarGroup>
      </Toolbar>
    )
  }
}
