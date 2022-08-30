import { API } from "@aws-amplify/api"
import React, { useEffect, useState } from "react"
import Spinner from "../components/spinner"
import GoogleMap from "../components/googleMap"
import { useLocation } from 'react-router-dom'
import Game from '../components/game'

interface PhotoArray {
  id: string
  imgUrl: string
}
;[]

export default function Play() {

  const location = useLocation()
  if (location) {
    console.log('locationState', location.state)
  }

  const [imagesState, setImagesState] = useState([])
  const [currentImageState, setCurrentImageState] = useState(0)

  // useEffect(() => {
  //   ;(async () => {
  //     const images = await API.get(
  //       import.meta.env.VITE_APIGATEWAY_NAME,
  //       "/getAllPhotos",
  //       {}
  //     )
  //     setImagesState(images)
  //     console.log("return IMAGE", images)
  //   })()
  // }, [])

  return (
    <>
    {/* { location.state.level && <Game /> } */}
    
    <div className="bg-yellow-700 h-screen">
      {/* <div className="flex justify-center"> */}
      <div className="grid grid-cols-3 grid-flow-row p-10 pt-80 justify-items-center">
        <div className="">Level 1</div>
        <div className="">Level 2</div>
        <div className="">Level 3</div>
      {/* </div> */}
      </div>
    </div>
    </>
  )
}
