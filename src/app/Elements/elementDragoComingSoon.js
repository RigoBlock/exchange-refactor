import { Card, CardMedia, CardText, CardTitle } from 'material-ui/Card'
import React, { Component } from 'react'

import styles from './elementDragoComingSoon.module.css'

class DragoComingSoon extends Component {
  render() {
    return (
      <Card className={styles.card}>
        <CardMedia>
          <img src="/img/rb_black.png" alt="" />
        </CardMedia>
        <CardTitle title="Store and manage your crypto assets in one place. Coming soon!" />
        <CardText />
      </Card>
    )
  }
}

export default DragoComingSoon
