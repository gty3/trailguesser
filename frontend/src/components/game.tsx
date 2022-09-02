import { API } from "@aws-amplify/api"
import React, { useEffect, useState } from "react"
import Spinner from "../components/spinner"
import GoogleMap from "../components/googleMap"
import { guessRes } from "../lib/api"
import { GuessLocationReturn, LatLng } from "../lib/types"
import Guessed from "./guessed"

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
  const [marker, setMarker] = React.useState<google.maps.LatLng>()
  const [actualData, setActualData] = useState<GuessLocationReturn>()
  const [guessing, setGuessing] = useState(false)

  const imagesObjArray = levelState.images

  const onClick = (e: google.maps.MapMouseEvent) => {
    setMarker(e.latLng!)
  }

  const nextImage = () => {
    nextPhoto()
    setActualData(undefined)
    setMarker(undefined)
  }

  const submitGuess = async () => {
    if (!marker) {
      return
    }
    setGuessing(true)
    const resData = await guessRes({
      latLng: marker,
      id: currentPhoto.id,
    })
    if (!resData.actualLocation) {
      throw "wtf, no image location"
    }
    setActualData({
      distance: Math.round(resData.distance),
      points: resData.points,
      actualLocation: resData.actualLocation,
      center: null,
    })
    setGuessing(false)
  }

  const nextPhoto = () => {
    if (currentImageState < 4) {
      setCurrentImageState(currentImageState + 1)
    } else {
      setLevelState("levels")
    }
  }

  const currentPhoto: PhotoArray = imagesObjArray[currentImageState]

  if (actualData && marker) {
    return (
      <>
        <Guessed
          actualData={actualData}
          marker={marker}
          nextImage={nextImage}
        />
      </>
    )
  } else {
    return (
      <div className="bg-yellow-70 h-screen">
        {levelState.images.length > 0 && (
          <img src={currentPhoto.url} className="h-screen object-cover" />
        )}

        <div
          className="md:mb-10 md:mr-10 md:h-52 md:w-52 md:hover:h-1/2 md:hover:w-1/2 md:hover:m-10 
            absolute bottom-20 right-0 h-64 w-full"
        >
          {levelState.images.length > 0 && (
            <GoogleMap
              click={onClick}
              marker={marker}
              actualData={actualData}
            />
          )}
            <button
              onClick={submitGuess}
              className="z-10 w-full flex justify-center p-1 m-1 bg-blue-400"
            >{!guessing ? "Guess!" : <Spinner className="pb-1" />}</button>
            
        </div>
      </div>
    )
  }
}
