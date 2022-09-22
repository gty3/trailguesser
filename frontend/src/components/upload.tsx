import React, { useRef, useState } from "react"
import { Auth, Storage } from "aws-amplify"
import { API } from "@aws-amplify/api"
import { v4 } from "uuid"
import Spinner from "../components/spinner"
import GoogleMapUpload from "../components/googleMapUpload"
import { uploadPhotoData } from "../lib/api"
import exifr from "exifr"
import { Image } from "../lib/types"
import NoExifComponent from "./noExif"

interface State {
  page: Image | null
  // loading: string
  imageArray: Image[]
  noExifArray: Image[]
}

export default function Upload() {
  /* I seperated out s3loading state because it was setting old state if in the other setState */
  const [s3loading, setS3loading] = useState<string>()
  // const [loading, setLoading] = useState<string>()
  const [state, setState] = useState<State>({
    // loading: "",
    imageArray: [],
    noExifArray: [],
    page: null,
  })
  // const loadingRef = useRef(null)
  // loadingRef.current = s3loading ?
  const mapRef = useRef()
  const imageRef = useRef<HTMLInputElement>(null)

  const photoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // setLoading("loading")
    setS3loading("loading")
    if (!e.target.files) {
      console.log("no files selected")
      return
    }

    const noLatLngArray = []
    const imageArray = []
    let sendToS3, sendToDb

    for (const file of e.target.files) {
      let latitude, longitude
      const uuid = v4()
      const fileType = file.name.split(".").pop()
      const uuidWfileType = uuid + "." + fileType
      imageArray.push({
        thumbnailUrl: URL.createObjectURL(file),
        uuid: uuidWfileType,
      })

      try {
        ;({ latitude, longitude } = await exifr.gps(file))
        sendToDb = uploadPhotoData({
          id: uuidWfileType,
          latLng: {
            lat: latitude,
            lng: longitude,
          },
        })
      } catch {
        noLatLngArray.push({
          thumbnailUrl: URL.createObjectURL(file),
          uuid: uuidWfileType,
          file: file,
        })
        ;(latitude = null), (longitude = null)
      }

      try {
        sendToS3 = Storage.put(uuidWfileType, file)
        console.log("sendToS3", sendToS3)
      } catch (err) {
        console.log(err)
      }
    }

    setState({
      ...state,
      imageArray: imageArray,
      noExifArray: noLatLngArray,
    })
    // const dbLoading = await sendToDb
    await sendToS3
    // console.log("s3Loading", s3Loading)
    setS3loading("success")
  }

  const shiftExifArray = () => {
    setState({...state, noExifArray: state.noExifArray.slice(1)})

  }

  console.log("statenoeix", state.noExifArray)

  if (state.noExifArray.length > 0) {
    return (
      <div>
        <NoExifComponent image={state.noExifArray[0]} shiftExifArray={shiftExifArray} />
      </div>
    )
  } else {
    return (
      <div className="">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <div className="flex flex-col ">
              <div className=" w-screen md:w-96 justify-center grid grid-cols-3">
                {state.imageArray.map((img) => (
                  <img key={img.uuid} className="h-20 my-4 mx-3" src={img.thumbnailUrl} />
                ))}
              </div>
              <div className="flex mt-40 justify-center">
                <input
                  multiple={true}
                  id="file-upload"
                  onChange={(e) => photoSelected(e)}
                  type="file"
                  className="bg-blue-100 rounded py-1 px-3 w-80 text-lg text-slate-700"
                  ref={imageRef}
                ></input>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex flex-col">
            {s3loading === "loading" ? (
              <Spinner className="text-xl mt-5" />
            ) : s3loading === "success" ? (
              <div className="text-xl mt-5">Successfully uploaded</div>
            ) : null}
          </div>
        </div>

        <div className="card"></div>
      </div>
    )
  }
}
