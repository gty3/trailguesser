import { API } from "@aws-amplify/api"
import React, { useEffect, useState } from "react"
import Spinner from "../components/spinner"
import GoogleMap from "../components/googleMap"
import { guessRes } from "../lib/api"
import { GuessLocationReturn, LatLng, LevelState } from "../lib/types"
import Guessed from "./guessed"
interface PhotoArray {
  id: string
  url: string
}
;[]

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
  const [guessing, setGuessing] = useState("")
  const [mapOpen, setMapOpen] = useState(true)

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
    setGuessing("loading")
    const resData = await guessRes({
      latLng: marker,
      id: currentPhoto.id,
      level: levelState.level,
    })
    console.log("resdatta should be that type", resData)
    if (!resData.actualLocation) {
      throw "wtf, no image location"
    }
    setActualData({
      distance: Math.round(resData.distance),
      points: resData.points,
      actualLocation: resData.actualLocation,
      center: resData.center,
      zoom: resData.zoom,
    })
    setGuessing("")
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
          currentImageState={currentImageState}
          actualData={actualData}
          marker={marker}
          nextImage={nextImage}
        />
      </>
    )
  } else {
    return (
      <div className="">
        <img
          src={currentPhoto.url}
          className="h-screen object-cover"
        />
        <div className="">
        <div
          className={
            (!mapOpen ? "hidden " : "") +
            `md:visible md:p-10 md:h-52 md:w-52 md:hover:h-2/3 md:hover:bottom-0
             md:hover:w-2/3 md:hover:p-20 md:hover:pb-32 absolute bottom-16 right-0 h-72 w-screen`
          }
        >
          <GoogleMap click={onClick} marker={marker} actualData={actualData} />
          <button
                onClick={submitGuess}
                className="md:block w-full hidden justify-center p-2 text-lg mt-2  bg-blue-600 text-white rounded"
              >
                {guessing === "loading" ? (
                  <Spinner className="pb-2 flex justify-center" />
                ) : marker ? (
                  "Guess!"
                ) : (
                  "Place a marker"
                )}
              </button>
        </div>

        <div className=" md:flex md:relative bottom-4 absolute w-screen">
          <div className="flex justify-center">
            <button
              className="md:hidden w-32 flex justify-center p-2 mt-2 mr-8 bg-blue-600 text-white rounded"
              onClick={() => setMapOpen(!mapOpen)}
            >
              {" "}
              {mapOpen ? "Hide map" : "Show map"}
            </button>
            {mapOpen && (
              <button
                onClick={submitGuess}
                className="md:hidden w-32 flex justify-center p-2  mt-2  bg-blue-600 text-white rounded"
              >
                {guessing === "loading" ? (
                  <Spinner className="pb-1" />
                ) : marker ? (
                  "Guess!"
                ) : (
                  "Place a marker"
                )}
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
    )
  }
}
