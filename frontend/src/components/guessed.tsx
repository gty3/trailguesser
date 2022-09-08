import { GuessLocationReturn, LatLng } from "../lib/types"
import GoogleMapGuessed from "./guessed/googleMapGuessed"

export default function Guessed({
  actualData,
  marker,
  nextImage,
}: {
  actualData: GuessLocationReturn
  marker: google.maps.LatLng
  nextImage: () => void
}) {
  const { distance, points } = actualData
  return (
    <div className="bg-gray-100 h-screen">
      <div className="flex justify-center pt-40 mb-2">
        Your guess was {distance} miles away
      </div>
      <div className="flex justify-center mb-4">You get {points} points!</div>
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
        className="flex justify-center mt-20 bg-blue-600 m-1 rounded-md p-2 text-white"
      >
        Next trail
      </button>
      </div>

    </div>
  )
}
