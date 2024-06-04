import React from 'react'
import { Outlet } from 'react-router-dom'
import NavigationBar from './NavigationBar'
import { GridPadding, Grid } from './styled/Containers.styled'

const Layout = () => {
  return (
    <>
      <Grid>
        <NavigationBar />
          <GridPadding>
            <Outlet />
          </GridPadding>
      </Grid>
    </>
    
  )
}

export default Layout