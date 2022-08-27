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

function usePageViews() {
  let location = useLocation();
  React.useEffect(() => {
    Fathom.trackPageview()
  }, [location]);
}

function App() {
  const [state, setState] = useState<State>({
    loading: false,
  })
  // console.log('import.meta.env.VITE_STAGE', import.meta.env.VITE_FATHOM)
  if (import.meta.env.VITE_STAGE === "prod") {
    Fathom.load(import.meta.env.VITE_FATHOM_ID)
    usePageViews()
  }

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
  )
}

export default App
