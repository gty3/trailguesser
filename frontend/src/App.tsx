import React, { useRef, useState } from "react"
import "./configureAmplify"
import Play from "./pages/play"
import Upload from "./pages/upload"
import Home from './pages/home'

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
        <Route path="/upload" element={<Upload />} />
      </Routes>


    </BrowserRouter>
  )
}

export default App
