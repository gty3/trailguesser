import { API } from "@aws-amplify/api"
import React, { useEffect, useState } from "react"
import Spinner from "../components/spinner"
import GoogleMap from "../components/googleMap"
import { useLocation } from "react-router-dom"
import Game from "../components/game"
import { retrieveLevel, getUserGames } from "../lib/api"

interface PhotoArray {
  id: string
  imgUrl: string
}
;[]
interface LocationState {
  level: string
  images: {
    id: string
    url: string
  }[]
}

export default function Play() {
  const [levelState, setLevelState] = useState<LocationState>()
  const [level1State, setLevel1State] = useState<LocationState>()
  const [level2State, setLevel2State] = useState<LocationState>()
  const [level3State, setLevel3State] = useState<LocationState>()

  const location = useLocation()
  const locationState = location.state as LocationState
  console.log("levelState", levelState)
  useEffect(() => {
    if (location && location.state) {
      setLevelState(locationState)
    }
    ;(async () => {
      const rL1 = retrieveLevel("1")
      const rL2 = retrieveLevel("2")
      const rL3 = retrieveLevel("3")
      setLevel1State(await rL1)
      setLevel2State(await rL2)
      setLevel3State(await rL3)
    })()
  }, [])

  if (!levelState) {
    ;(async () => {
      const levelsCompleted = await getUserGames()

      console.log("levelsCompleted", levelsCompleted)
      if (levelsCompleted.levels.length < 1) {
        setLevelState(await retrieveLevel("1"))
      } else {
        setLevelState({
          level: "levels",
          images: []
        })
      }

    })()

    return <div>Error</div>
  }
  console.log("levelState;", levelState)

  const CustyButton = ({
    levelState,
  }: {
    levelState: LocationState | undefined
  }) => {
    return (
      <div
        onClick={() => setLevelState(levelState)}
        className="flex justify-center m-2 cursor-pointer rounded-md outline-1 outline px-2 text-xl"
      >
        Play
      </div>
    )
  }

  if (parseInt(levelState.level)) {
    return (
      <div>
        <div>
          <Game levelState={levelState} setLevelState={setLevelState} />
        </div>
      </div>
    )
  } else {
    return (
      <>
        <div className="bg-yellow-700 h-screen">
          <div className="grid grid-cols-3 grid-flow-row p-10 pt-80 justify-items-center">
            <div className="">
              <img src={level1State?.images[0].url} className="h-40 w-40"></img>
              <div>Level 1</div>
              <CustyButton levelState={level1State} />
            </div>
            <div className="">
              <img src={level2State?.images[0].url} className="h-40 w-40"></img>
              <div>Level 2</div>
              <CustyButton levelState={level2State} />
            </div>
            <div className="">
              <img src={level3State?.images[0].url} className="h-40 w-40"></img>
              <div>Level 3</div>
              <CustyButton levelState={level3State} />
            </div>
            {/* </div> */}
          </div>
        </div>
      </>
    )
  }
}
