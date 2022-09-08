import { API } from "aws-amplify"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { retrieveLevel, getUserGames } from "../lib/api"

interface LevelData {
  level: string
  images: {
    id: string
    url: string
  }[]
}

export default function Home() {
  const [levelDataState, setLevelDataState] = useState<LevelData>()
  console.log('levelDataState',levelDataState)
  useEffect(() => {
    ;(async () => {
      const levelsCompleted = await getUserGames()

      console.log("levelsCompleted", levelsCompleted)
      if (levelsCompleted.levels.hasOwnProperty('id')) {
        setLevelDataState(await retrieveLevel("1"))
      } else {
        setLevelDataState({
          level: "levels",
          images: []
        })
      }

    })()
  }, [])

  return (
    <div
      className="bg-yellow-700 h-screen bg-cover"
      style={{ backgroundImage: "url(finn.jpg)" }}
    >
      <div className="">
        <div className="pt-48 px-4 flex justify-center text-7xl text-white italic">
          RIDE THE WORLD
        </div>
        <div className="flex justify-center text-white text-xl">
          Guess where in the world the trail is
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            state={levelDataState && { ...levelDataState }}
            to="/play"
            className="border px-8 rounded m-3 p-2 bg-white hover:bg-gray-200 focus:bg-gray-400"
          >
            Play
          </Link>
        </div>
        <div className="mt-32 flex justify-center">
          <Link
            to="/upload"
            className="border rounded m-3 p-2 bg-white hover:bg-gray-200 focus:bg-gray-400"
          >
            Upload photos
          </Link>
        </div>
      </div>
    </div>
  )
}
