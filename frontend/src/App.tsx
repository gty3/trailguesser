import React, { useRef, useState } from "react"
import "./configureAmplify"
import Play from "../components/play"
import Upload from "../components/upload"
import Home from '../components/home'

import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

interface State {
  loading: boolean
  messengerAddress?: string
}

function App() {
  const [state, setState] = useState<State>({
    loading: false,
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
      </Routes>


    </BrowserRouter>
  )
}

export default App
