import React, { useRef, useEffect, useState } from "react"
import "./configureAmplify"
import Play from "./pages/play"
import Upload from "./pages/upload"
import Home from "./pages/home"
import * as Fathom from "fathom-client"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

interface State {
  loading: boolean
  messengerAddress?: string
}

function App() {
  const [state, setState] = useState<State>({
    loading: false,
  })
  let fathomLoaded = useRef(false)
  let location = useLocation()

  useEffect(
    function setupFathom() {
      if (!fathomLoaded.current) {
        Fathom.load(import.meta.env.VITE_FATHOM_ID, { includedDomains: ["trailguesser.com"] })
        fathomLoaded.current = true
      } else {
        Fathom.trackPageview()
      }
    },
    [location]
  ),
    []

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
