import React, { useRef, useEffect, useState } from "react"
import "./configureAmplify"
import Play from "./pages/play"
import Upload from "./pages/upload"
import Home from "./pages/home"
import * as Fathom from "fathom-client"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Admin from "./pages/admin"
import Login from "./pages/login"
import Blank from "./pages/blank"
import AdminDaily from "./pages/adminDaily"
import { getAllLevels, getUserGames } from "./lib/api"
import { CompletedLevels, LevelsMap } from "./lib/types"

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

  //   const [levelsState, setLevelsState] = useState<LevelsMap>()
  //   const [completedState, setCompletedState] = useState<CompletedLevels>({})
  // const [pageState, setPageState] = useState<string>("loading")

  // console.log('import.meta.env.VITE_STAGE', import.meta.env.VITE_FATHOM)
  if (import.meta.env.VITE_STAGE === "prod") {
    Fathom.load(import.meta.env.VITE_FATHOM_ID)
    usePageViews()
  }

  // useEffect(() => {
  //   ;(async () => {
  //     const completedGames = getUserGames()
  //     const allLevels = getAllLevels()
  //     const games = await completedGames
  //     const levels = await allLevels
  //     if (!levels) {
  //       return
  //     }

  //     if (Object.keys(games.levels).length === 0) {
  //       setPageState("USA")
  //     } else {
  //       games.levels && setCompletedState(games.levels)
  //       setPageState("levels")
  //     }
  //     setLevelsState(levels)
  //   })()
  // }, [])

  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blank" element={<Blank />} />
        <Route path="/admindaily" element={<AdminDaily />} />
      </Routes>
  )
}

export default App
