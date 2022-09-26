import { GuessLocationReturn, LatLng, LevelState } from "../lib/types"
import GoogleMapGuessed from "./guessed/googleMapGuessed"

export default function Guessed({
  currentImageState,
  actualData,
  marker,
  nextImage,
}: {
  currentImageState: number
  actualData: GuessLocationReturn
  marker: google.maps.LatLng
  nextImage: () => void
}) {
  const { distance, points } = actualData

  const pointsToPercent = (points: number): string => {
    const percent = Math.round(points / 50)
    return "w-[" + percent + "%]"
  }

  const percentage = pointsToPercent(points)
  const pointsWithComma = points.toLocaleString("en-US")

  return (
    <div className=" flex flex-col pt-24 justify-center">
      <div className="flex justify-center">
        <div
          className="md:h-96 md:w-1/2
      h-80 w-screen"
        >
          <GoogleMapGuessed actualData={actualData} marker={marker} />
        </div>
      </div>

      <div className="flex justify-center mt-4 mb-2 text-xl">
        {pointsWithComma} points
      </div>
      <div className="flex justify-center mx-4">
        <div className="w-full max-w-3xl bg-slate-300 rounded-full h-1.5 mb-4 dark:bg-gray-700">
          <div
            className={"bg-blue-700 h-1.5 rounded-full dark:bg-blue-500 " + percentage}
            
          ></div>
        </div>
      </div>
      <div className="flex justify-center mb-2">
        Your guess was {distance} miles away
      </div>
      <div className="flex justify-center">
        <button
          onClick={nextImage}
          className="flex justify-center mt-20 bg-blue-600 m-1 text-lg rounded-md p-2 text-white"
        >
          {currentImageState === 4 ? "Menu" : "Next Trail"}
        </button>
      </div>
    </div>
  )
}
