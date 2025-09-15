import { useState } from 'react'
import './App.css'
import Home from './layout/Home'
import Tarjeta from './layout/Tarjeta'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/tarjeta' element={<Tarjeta/>} />
    </Routes>
    
    </>
  )
}

export default App
