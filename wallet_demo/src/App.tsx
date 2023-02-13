import React from 'react'
import logo from './logo.svg'
import './App.css'
import Web3ReactProvider from './models/Web3ReactProvider'
import Home from './pages/home'

function App() {
  return (
    <div className='App'>
      <Web3ReactProvider>
        <Home />
      </Web3ReactProvider>
    </div>
  )
}

export default App
