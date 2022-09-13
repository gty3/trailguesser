import React, { useRef, useState } from "react"
import { Storage } from "aws-amplify"
import { API } from "@aws-amplify/api"
import { v4 } from "uuid"
import Spinner from "../components/spinner"
import GoogleMapUpload from "../components/googleMapUpload"
import { uploadPhotoData } from "../lib/api"
interface State {
  loading: string
  displayURL?: string
  lat: number | null
  lng: number | null
  s3Loading: boolean
  error: string
  uuid: string
}


export default function Upload() {
  const [state, setState] = useState<State>({
    loading: "",
    lat: null,
    lng: null,
    s3Loading: false,
    error: "",
    uuid: "",
  })
  const mapRef = useRef()
  const imageRef = useRef<HTMLInputElement>(null)
  const trailNameRef = useRef<HTMLInputElement>(null)

  const photoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.log("no files selected")
      return
    }
    if (!trailNameRef.current) {
      console.log("ref error, wtf")
      return
    }
    if (!imageRef.current || !imageRef.current.files) {
      console.log("no image")
      return
    }
    const uuid = v4()
    trailNameRef.current.value = ""
    setState({
      // ...state,
      displayURL: URL.createObjectURL(e.target.files[0]),
      loading: "",
      s3Loading: true,
      uuid: uuid,
      error: "",
      lat: null,
      lng: null
    })
    console.log("UUID photoselected", uuid)
    try {
      const fileType = imageRef.current.files[0].name.split(".").pop()
      const uuidWfileType = uuid + "." + fileType
      const sendToS3 = await Storage.put(
        uuidWfileType,
        imageRef.current.files[0]
      )
      /* cannot set state here, fucks with shit */
    } catch (err) {
      console.log(err)
    }
  }

  const uploadPhoto = async () => {
    if (!import.meta.env.VITE_APIGATEWAY_NAME) {
      console.log("no env")
      return
    }
    if (!imageRef.current?.files) {
      console.log("no image")
      setState({ ...state, error: "file" })
      return
    }
    if (!state.lat || !state.lng) {
      setState({ ...state, error: "latLng" })
      return
    }
    setState({ ...state, loading: "loading" })
    const fileType = imageRef.current.files[0].name.split(".").pop()
    const uuidWfileType = state.uuid + "." + fileType

    const successString = await uploadPhotoData({
      id: uuidWfileType, 
      latLng: {
        lat: state.lat,
        lng: state.lng
      },
      trailName: trailNameRef.current?.value
    })
    setState({ ...state, loading: successString })


  }

  const updateLocation = ({ lat, lng }: { lat: number; lng: number }) => {
    setState({ ...state, lat: lat, lng: lng })
  }

  return (
    <div>
      <div className="flex flex-col mt-6">
        <div className="flex justify-center">
          <div className="flex flex-col">
            <div className="h-64 w-64 -mb-10 ml-10">
              <img src={state.displayURL} />
            </div>
            {state.error === "file" ? (
              <input
                onChange={(e) => photoSelected(e)}
                type="file"
                className="bg-gray-100 rounded px-2 m-1 text-red-600"
                ref={imageRef}
              ></input>
            ) : (
              <input
                onChange={(e) => photoSelected(e)}
                type="file"
                className="bg-gray-100 rounded py-1 px-3 m-1"
                ref={imageRef}
              ></input>
            )}
          </div>
        </div>
        <div className=" mt-10 flex justify-center">
          <div className="flex flex-col">
            {" "}
            <input
              type="text"
              placeholder="Trail name, leave blank if unknown"
              className="bg-gray-100 rounded py-1 px-3 m-1"
              ref={trailNameRef}
            ></input>
            <div className="h-80 w-80 mt-8">
              {state.error === "latLng" ? (
                <div className="mb-1 text-lg text-red-600">
                  Drop a pin of the photo location
                </div>
              ) : (
                <div className="mb-2">Drop a pin of the photo location</div>
              )}
              <GoogleMapUpload state={state} updateLocation={updateLocation} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <div className="flex flex-col">
          {
          state.loading === "success" ? (
            <div className="mt-10">Successfully uploaded</div>
          ) : state.loading === "loading" ? (
            <div className="flex flex-col mt-10">
              <Spinner className="flex justify-center" />
            </div>
          ) : (
            <button
              onClick={() => uploadPhoto()}
              className="font-normal mb-10 mt-10 m-1 py-1 px-3 rounded outline-1 bg-blue-50 outline outline-blue-700
               hover:bg-blue-100 "
            >
              Upload Photo
            </button>
          )}
          <div>
            {}
          </div>
        </div>
      </div>

      <div className="card"></div>
    </div>
  )
}
