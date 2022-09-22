import { uploadPhotoData } from "../lib/api"
import { useState } from "react"
import { Image } from "../lib/types"
import GoogleMapUpload from "./googleMapUpload"

const NoExifComponent = ({
  image,
  shiftExifArray,
}: {
  image: Image
  shiftExifArray: () => void
}) => {

  console.log("image", image)

  return (
    <div>
      <div className="">
        <div className="flex flex-col items-center">
          <img className="h-40" src={image.thumbnailUrl} />
          This image doesn't have any location data, drop a pin on the map below
          <div className="w-screen h-80 md:w-96 mt-2">
            <GoogleMapUpload image={image} />
          </div>
          <button
            onClick={shiftExifArray}
            className="flex bg-blue-600 mt-6 text-white justify-center p-1.5 cursor-pointer rounded-md px-3 text-2xl text-thin"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
export default NoExifComponent
