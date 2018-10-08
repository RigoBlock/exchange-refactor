import { withRouter } from 'react-router-dom'
import AppBar from 'material-ui/AppBar'
import NavLinksLeft from '../../Elements/topBarMenuLinksLeft'
import NavLinksRight from '../../Elements/topBarMenuLinksRight'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './applicationTopBar.module.css'

class ApplicationTopBar extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    handleTopBarSelectAccountType: PropTypes.func.isRequired,
    handleToggleNotifications: PropTypes.func.isRequired
  }

  static defaultProps = {
    handleTopBarSelectAccountType: () => {}
  }

  renderBurgerMenu = () => {
    return (
      <div>
        <input type="checkbox" id="menu-toggle" className={styles.menuToggle} />
        <label id="trigger" htmlFor="menu-toggle" className={styles.trigger}>
          <div className={styles.beta}>&beta;</div>
          <img
            style={{ height: '38px', marginLeft: '-5px', marginTop: '-5px' }}
            src="/img/rb-logo-final.png"
          />
        </label>
        <div className={styles.menu}>
          <div className={styles.burgerContainer}>
            <ul id="menu" className={styles.linkItem}>
              <li>
                <a
                  href="https://www.rigoblock.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="https://community.rigoblock.com/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="https://help.rigoblock.com/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Help
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {
      location,
      handleTopBarSelectAccountType,
      handleToggleNotifications
    } = this.props
    return (
      <div>
        <div>{this.renderBurgerMenu()}</div>

        <AppBar
          title={<NavLinksLeft location={location} />}
          showMenuIconButton={false}
          iconElementLeft={<NavLinksLeft location={location} />}
          iconElementRight={
            <NavLinksRight
              handleToggleNotifications={handleToggleNotifications}
              location={location}
              handleTopBarSelectAccountType={handleTopBarSelectAccountType}
            />
          }
          style={{
            background: 'linear-gradient(135deg,rgb(5, 65, 134),rgb(1, 17, 36))'
          }}
        />
      </div>
    )
  }
}

export default withRouter(ApplicationTopBar)
