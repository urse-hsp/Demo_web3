import React, { useState, useEffect } from 'react'
import { fn11 } from './fn'

import './App.css'

function App() {
  useEffect(() => {
    fn11()
  }, [])
  return <div className='App'>123</div>
}

export default App
