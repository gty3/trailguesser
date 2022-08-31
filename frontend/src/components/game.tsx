import { API } from "@aws-amplify/api"
import React, { useEffect, useState } from "react"
import Spinner from "../components/spinner"
import GoogleMap from "../components/googleMap"

interface PhotoArray {
  id: string
  url: string
}
;[]

interface LevelState {
  level: string
  images: {
    id: string
    url: string
  }[]
}

export default function Play({
  levelState,
  setLevelState,
}: {
  levelState: LevelState
  setLevelState: any
}) {
  const [currentImageState, setCurrentImageState] = useState(0)
  const imagesObjArray = levelState.images

  const nextPhoto = () => {
    if (currentImageState < 4) {
      setCurrentImageState(currentImageState + 1)
    } else {
      setLevelState("levels")
    }
  }

  const currentPhoto: PhotoArray = imagesObjArray[currentImageState]

  return (
    <div className="bg-yellow-70 h-screen">
      {levelState.images.length > 0 && (
        <img src={currentPhoto.url} className="h-screen object-cover" />
      )}
      {/* <div>{!state && <Spinner />}</div> */}
      {/* <button onClick={nextPhoto} className="border rounded m-3 p-2 bg-white hover:bg-gray-200 focus:bg-gray-400">next</button> */}
      <div
        className="md:mb-10 md:mr-10 md:h-52 md:w-52 md:hover:h-1/2
         md:hover:w-1/2 absolute bottom-10 right-0
      h-64 w-full"
      >
        {levelState.images.length > 0 && (
          <GoogleMap nextPhoto={nextPhoto} imageId={currentPhoto.id} />
        )}
      </div>
    </div>
  )
}
