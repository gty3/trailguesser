import { API } from "@aws-amplify/api"
import React, { useEffect, useState } from "react"
import Spinner from "../components/spinner"
import GoogleMap from "../components/googleMap"
// import { useLocation } from "react-router-dom"
import Game from "../components/game"
import { retrieveLevel, getUserGames, getAllLevels } from "../lib/api"
import Email from "../components/email"
import { LevelObj, LevelsMap } from "../lib/types"

interface PhotoArray {
  id: string
  imgUrl: string
}
;[]

export default function Play() {
  const [pageState, setPageState] = useState<string>("loading")
  const [levelsState, setLevelsState] = useState<LevelsMap>()

  // const location = useLocation()
  // const locationState = location.state as LocationState

  useEffect(() => {
    // if (location && location.state) {
    //   setLevelState(locationState)
    // }
    ;(async () => {
      const completedGames = getUserGames()
      const allLevels = getAllLevels()
      const games = await completedGames
      const levels = await allLevels
      if (!levels) {
        return
      }
      if (!games.levels) {
        setPageState("USA")
      }
      setPageState("levels")
      setLevelsState(levels)
    })()
  }, [])

  const CustyButton = ({ level }: { level: string }) => {
    return (
      <div
        onClick={() => setPageState(level)}
        className="flex bg-blue-600 drop-shadow-lg text-white justify-center m-2 p-1 cursor-pointer rounded-md px-2 text-2xl text-thin"
      >
        Play
      </div>
    )
  }

  if (pageState === "loading") {
    return <Spinner />
  } else if (pageState === "levels") {
    return (
      <>
        <div className="">
          <div className="grid md:grid-flow-col md:pt-80 justify-items-center">
            {Object.entries(levelsState!).map(([level, images]) => (
              <div>
                <img src={images[0].url} className="h-40 w-40 mt-10"></img>
                <div className="flex justify-center">{level}</div>
                <CustyButton level={level} />
              </div>
            ))}
            <div className=""></div>
          </div>
          <Email />
        </div>
      </>
    )
  } else {
    return (
      <Game
        levelState={{ level: pageState, images: levelsState![pageState] }}
        // pageState={pageState}
        setLevelState={setLevelsState}
      />
    )
  }
}
