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
  return (
    <div className=" flex flex-col pt-24 justify-center">
      <div className="flex justify-center mb-2">
        Your guess was {distance} miles away
      </div>
      <div className="flex justify-center mb-4 text-xl">You get {points} points!</div>
      <div className="flex justify-center">
        <div
          className="md:h-96 md:w-1/2
      h-80 w-screen"
        >
          <GoogleMapGuessed actualData={actualData} marker={marker} />
        </div>
        
      </div>
      <div className="flex justify-center">
      <button
        onClick={nextImage}
        className="flex justify-center mt-20 bg-blue-600 m-1 text-lg rounded-md p-2 text-white"
      >
        { (currentImageState === 4) ? "Menu" : "Next Trail" }
      </button>
      </div>

    </div>
  )
}
