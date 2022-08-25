import { API } from "aws-amplify"
import React, { useEffect, useState } from "react"
import Spinner from "../components/spinner"
import GoogleMap from "../components/googleMap"

interface PhotoArray {
  id: string
  imgUrl: string
}
;[]

export default function Play() {
  const [imagesState, setImagesState] = useState([])
  const [currentImageState, setCurrentImageState] = useState(0)

  useEffect(() => {
    ;(async () => {
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

  const currentPhoto: PhotoArray = imagesState[currentImageState]
  // console.log(currentPhoto.imgUrl)

  return (
    <div className="bg-yellow-700">
      {imagesState.length > 0 && (
        <img src={currentPhoto.imgUrl} className="h-screen" />
      )}
      {/* <div>{!state && <Spinner />}</div> */}
      {/* <button onClick={nextPhoto} className="border rounded m-3 p-2 bg-white hover:bg-gray-200 focus:bg-gray-400">next</button> */}
      <div className="h-44 w-44 hover:h-1/2 hover:p-10 hover:pb-20 hover:w-1/2 absolute bottom-10 right-0">
        {imagesState.length > 0 && (
          <GoogleMap nextPhoto={nextPhoto} imageId={currentPhoto.id} />
        )}
      </div>
    </div>
  )
}
