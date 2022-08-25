import { API } from "aws-amplify"
import React, { useEffect, useState } from "react"
import Spinner from "./spinner"
import GoogleMap from './googleMap'

export default function Play() {
  const [imagesState, setImagesState] = useState([])
  const [currentImageState, setCurrentImageState] = useState(0)

  useEffect(() => {
    (async () => {
      const images = await API.get(
        import.meta.env.VITE_APIGATEWAY_NAME,
        "/getAllPhotos",
        {}
      )
      setImagesState(images)
      console.log("return IMAGE", images)
    })()
  }, [])

  const nextPhoto = () => {
    setCurrentImageState(currentImageState + 1)
  }

  return (
    <div className="bg-yellow-700">
        {imagesState && <img src={imagesState[currentImageState]} className="h-screen" />}
        {/* <div>{!state && <Spinner />}</div> */}
        <button onClick={nextPhoto} className="border rounded m-3 p-2 bg-white hover:bg-gray-200 focus:bg-gray-400">next</button>
    <GoogleMap imageId={"9a007c10-5a77-4445-a91a-e911326c74f6.jpg"}/>
    </div>

  )
}
