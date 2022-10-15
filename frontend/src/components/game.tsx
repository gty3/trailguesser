import { API } from "@aws-amplify/api"
import React, { useEffect, useState } from "react"
import Spinner from "../components/spinner"
import GoogleMap from "../components/googleMap"
import { guessRes, newGame } from "../lib/api"
import { GuessLocationReturn, LatLng, LevelObj } from "../lib/types"
import Guessed from "./guessed"
import { useNavigate } from "react-router-dom"


export default function Play({
  levelState,
  setLevelState,
  
}: {
  levelState: LevelObj
  setLevelState: any
}) {
  const [currentImageState, setCurrentImageState] = useState(0)
  const [marker, setMarker] = React.useState<google.maps.LatLng>()
  const [actualData, setActualData] = useState<GuessLocationReturn>()
  const [guessing, setGuessing] = useState("")
  const [mapOpen, setMapOpen] = useState(false)

  const imagesObjArray = levelState.images

  const onClick = (e: google.maps.MapMouseEvent) => {
    setMarker(e.latLng!)
  }
  const navigate = useNavigate()

  const nextImage = () => {
    if (currentImageState < 4) {
      setCurrentImageState(currentImageState + 1)
      setActualData(undefined)
      setMarker(undefined)
      setMapOpen(false)
    } else {
      navigate(0)
    }
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

  const currentPhoto = imagesObjArray[currentImageState]

  useEffect(() => {
    ;(async () => {
      console.log("newGame fn called")
      await newGame({
        level: levelState.level,
        photoId: currentPhoto.id,
      })
    })()
  }, [currentImageState])

  // useEffect(() => {
  //   const scrollDistance =
  //     (document.getElementById("scroller")!.scrollWidth -
  //       document.getElementById("scroller")!.clientWidth) /
  //     2
  //   document.getElementById("scroller")?.scroll({
  //     left: scrollDistance,
  //     top: 0,
  //     behavior: "smooth",
  //   })
  // }, [document.getElementById("scroller")])

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
      <div className="overflow-auto bg-cover md:flex md:justify-center" id="scroller" style={{backgroundImage: `url(${currentPhoto.blurryUrl})` }}>
        {/* <div className="h-screen bg-center bg-cover bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${currentPhoto.url})` }}> */}
        <img
          
          src={currentPhoto.url}
          className="h-screen max-w-max relative
          md:h-screen "
        />
        <div className="">
          <div
            className={
              (!mapOpen ? "hidden " : "") +
              `md:block md:p-10 md:h-52 md:w-52 
             md:hover:h-2/3 md:hover:bottom-0 md:hover:w-2/3 md:hover:p-20 md:hover:pb-32 
             absolute bottom-16 right-0 h-72 w-screen`
            }
          >
            <GoogleMap
              click={onClick}
              marker={marker}
              actualData={actualData}
            />
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

          {/* <div className="flex justify-center"> */}
          {mapOpen ? (
            <div
              className=" md:flex md:relative
         bottom-4 absolute w-64 ml-auto mr-auto left-0 right-0 flex"
            >
              <button
                className="md:hidden w-32 flex justify-center p-2 mt-2 mr-8 bg-blue-600 text-white rounded"
                onClick={() => setMapOpen(!mapOpen)}
              >
                Hide map
              </button>

              <button
                onClick={submitGuess}
                className="md:hidden w-32 flex justify-center p-2  mt-2  bg-blue-600 text-white rounded"
              >
                {guessing === "loading" ? (
                  <Spinner className="pb-1" />
                ) : marker ? (
                  "Guess!"
                ) : (
                  "Place marker"
                )}
              </button>
            </div>
          ) : (
            <div
              className=" md:flex md:relative
              bottom-4 absolute w-48 ml-auto mr-auto left-0 right-0 flex"
            >
              {" "}
              <button
                className="md:hidden w-48 flex justify-center p-2 mt-2 bg-blue-600 text-white rounded"
                onClick={() => setMapOpen(!mapOpen)}
              >
                Show map
              </button>
            </div>
          )}

          {/* </div> */}
        </div>
        {/* </div> */}
      </div>
    )
  }
}
