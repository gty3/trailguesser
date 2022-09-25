import React, { useRef, useEffect, useState } from "react"
import "./configureAmplify"
import Play from "./pages/play"
import Upload from "./pages/upload"
import Home from "./pages/home"
import * as Fathom from "fathom-client"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Admin from "./pages/admin"
import Login from "./pages/login"

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
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
  )
}

export default App
