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

  const bgImage = {
    bucket: import.meta.env.VITE_BUCKET_NAME,
    key: import.meta.env.VITE_STAGE === 'prod' ? "public/fd358f5c-65dd-4fbf-8713-101b96f13ee7.jpg" : "public/0a293466-3abb-4ff2-aee6-d1cba6474453.jpg"
    ,
    edits: {
      resize: {
        // width: "" + window.innerWidth,
        height: window.innerHeight,
        fit: "cover",
      },
    },
  }
  console.log(JSON.stringify(bgImage))
  const blurry = window.btoa(JSON.stringify(bgImage))
  const blurryUrl = import.meta.env.VITE_SERVERLESS_IMAGE_HANDLER + blurry
  console.log(blurryUrl)
  
  return (
    <div
      className="h-screen bg-cover flex flex-col justify-center pb-12"
      style={{ backgroundImage: `url(${blurryUrl})` }}
    >
      <div className="">
        <div className="px-4 flex justify-center text-7xl text-white italic">
          RIDE THE WORLD
        </div>
        <div className="flex justify-center text-white text-xl">
          Guess where in the world the trail is
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            state={levelDataState && { ...levelDataState }}
            to="/play"
            className="flex bg-blue-600 drop-shadow-xl text-white justify-center mx-8 px-10 p-2 cursor-pointer rounded-md text-2xl text-thin shadow-lg"
          >
            Play
          </Link>
        </div>
        <div className="mt-32 flex justify-center">
          <Link
            to="/upload"
            className="flex bg-blue-600 text-white drop-shadow-xl justify-center mx-8 p-1.5 cursor-pointer rounded-md px-3 text-2xl text-thin"
          >
            Upload photos
          </Link>
        </div>
      </div>
    </div>
  )
}
