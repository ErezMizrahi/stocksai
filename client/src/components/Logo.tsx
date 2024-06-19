import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logo = () => {
  const navigate = useNavigate();
  return (
    <h1 style={{cursor: 'pointer'}} onClick={() => navigate('/')}>Stocks<span style={{color: '#a30000'}}>AI</span></h1>
  )
}

export default Logo