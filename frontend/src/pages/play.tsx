import { API } from "@aws-amplify/api"
import React, { useEffect, useState } from "react"
import Spinner from "../components/spinner"
import GoogleMap from "../components/googleMap"
import { useLocation } from "react-router-dom"
import Game from "../components/game"
import { retrieveLevel, getUserGames } from "../lib/api"
import Email from "../components/email"

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
      if (Object.keys(levelsCompleted.levels).length > 0) {
        setLevelState({
          level: "levels",
          images: [],
        })
      } else {
        setLevelState(await retrieveLevel("1"))
      }
    })()

    return (
      <div className="flex justify-center mt-80">
        <Spinner />
      </div>
    )
  }


  const CustyButton = ({
    levelState,
  }: {
    levelState: LocationState | undefined
  }) => {
    return (
      <div
        onClick={() => setLevelState(levelState)}
        className="flex bg-blue-600 text-white justify-center m-2 p-1 cursor-pointer rounded-md px-2 text-2xl text-thin"
      >
        Play
      </div>
    )
  }

  if (parseInt(levelState.level)) {
    return (
      // <div>
      //   <div>
          <Game levelState={levelState} setLevelState={setLevelState} />
      //   </div>
      // </div>
    )
  } else {
    return (
      <>
        <div className="bg-gray-100 h-screen">
          <div className="grid md:grid-flow-col md:pt-80 justify-items-center">
            <div className="">
              <img
                src={level1State?.images[0].url}
                className="h-40 w-40 mt-10"
              ></img>
              <div className="flex justify-center">Level 1</div>
              <CustyButton levelState={level1State} />
            </div>
            <div className="">
              <img
                src={level2State?.images[0].url}
                className="h-40 w-40 mt-10"
              ></img>
              <div className="flex justify-center">Level 2</div>
              <CustyButton levelState={level2State} />
            </div>
            <div className="">
              <img
                src={level3State?.images[0].url}
                className="h-40 w-40 mt-10"
              ></img>
              <div className="flex justify-center">Level 3</div>
              <CustyButton levelState={level3State} />
            </div>
            {/* </div> */}
          </div>
          <Email />
        </div>
      </>
    )
  }
}
