import React from "react"
import { Link } from "react-router-dom"

export default function Home() {
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
            to="/play"
            className="border rounded m-3 p-2 bg-white hover:bg-gray-200 focus:bg-gray-400"
          >
            Play the Beta
          </Link>
        </div>
        <div className="mt-72 flex justify-center">
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
