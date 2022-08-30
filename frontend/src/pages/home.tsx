import { API } from "aws-amplify"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import getUserGames from "../lib/getUserGames"

export default function Home() {
  const lastLevelCompleted = getUserGames()
  console.log('lastLevelCompleted', lastLevelCompleted)
  const level = lastLevelCompleted ? "showLevels" : "1"

  const [levelDataState, setLevelDataState] = useState()

  if (!lastLevelCompleted) {
    useEffect(() => {
      ;(async () => {
        const params = { body: { level: "1" } }
        const levelData = await API.post(
          import.meta.env.VITE_APIGATEWAY_NAME,
          "/retrieveLevel",
          params
        )
        setLevelDataState(levelData)
        console.log('leveldata', levelData)
      })()
      
    }, [])
  }

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
            state={levelDataState && { level: levelDataState }}
            to="/play"
            className="border rounded m-3 p-2 bg-white hover:bg-gray-200 focus:bg-gray-400"
          >
            Play the Beta
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
