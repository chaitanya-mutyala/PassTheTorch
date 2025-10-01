import React from 'react'
import logo from '../assets/logo.jpeg'

function Logo({width='100px'}) {
  return (
    
    <img 
        src={logo} 
        alt="Pass The Torch Logo" 
        style={{ width }} 
        className='object-cover'
    />
  )
}

export default Logo
