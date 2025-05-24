import React from 'react'
import Home from './components/Home'
import Menu from './components/Menu'
import Order from './components/Order'
import Footer from './components/Footer'

const Homepage = () => {
  return (
    <div className='flex flex-col min-h-screen items-center justify-center'>
      <Home />
      <Menu />
      <Order />
      <Footer />
    </div>
  )
}

export default Homepage