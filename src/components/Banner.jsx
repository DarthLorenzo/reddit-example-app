import React, { useContext } from 'react'
import classNames from 'classnames'

import { AppStateContext } from '../data/DataStore'

const Banner = () => {
  const { subredditData, fetchingAbout } = useContext(AppStateContext)

  const banner = subredditData ? subredditData.banner : ''
  return (
    <header
      className={classNames({ loading: fetchingAbout })}
      style={{ '--bg-img-src': `url(${banner})` }}
    />
  )
}

export default Banner
