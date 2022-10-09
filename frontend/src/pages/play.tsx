import { API } from "@aws-amplify/api"
import React, { useEffect, useState } from "react"
import Spinner from "../components/spinner"
import GoogleMap from "../components/googleMap"
// import { useLocation } from "react-router-dom"
import Game from "../components/game"
import { retrieveLevel, getUserGames, getAllLevels } from "../lib/api"
import Email from "../components/email"
import { LevelObj, LevelsMap, UserLevels } from "../lib/types"
import Medal from "../components/medal"
interface CompletedLevels {
  [level: string]: Record<string, any>
}

export default function Play() {
  const [pageState, setPageState] = useState<string>("loading")
  const [levelsState, setLevelsState] = useState<LevelsMap>()
  const [completedState, setCompletedState] = useState<CompletedLevels>({})

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

      if (Object.keys(games.levels).length === 0) {
        setPageState("USA")
      } else {
        games.levels && setCompletedState(games.levels)
        setPageState("levels")
      }
      setLevelsState(levels)
    })()
  }, [])

  const CustyButton = ({ level }: { level: string }): JSX.Element => {
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
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  } else if (pageState === "levels") {
    return (
      <>
        <div className="">
          <div className="grid md:grid-flow-col md:pt-80 justify-items-center">
            {Object.entries(levelsState!).map(([level, images]) => (
              console.log("images[0]", images[0]),
              <div key={level} className="">
                {completedState[level] &&
                  Object.values(completedState[level]).length > 4 && (
                    <Medal className="h-10 w-10 absolute ml-28 mt-10 fill-slate-100" />
                  )}
                <img
                  src={
                    completedState[level] ? images[0].thumbnailUrl : images[0].blurryUrl
                  }
                  className="h-40 w-40 mt-10 object-cover"
                />
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
        setLevelState={setLevelsState}
      />
    )
  }
}
