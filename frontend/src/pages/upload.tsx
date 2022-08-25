import React, { useRef, useState } from "react"
import { Storage, API } from "aws-amplify"
import { v4 } from "uuid"
import Spinner from "../components/spinner"
import GoogleMapUpload from "../components/googleMapUpload"

interface State {
  loading: string
  displayURL?: string
  lat: number | null
  lng: number | null
}
interface PostPhotoParams {
  id: string
  trailName?: string
  latLng: {
    lat: number
    lng: number
  }
}

export default function Upload() {
  const [state, setState] = useState<State>({
    loading: "",
    lat: null,
    lng: null,
  })
  const mapRef = useRef()
  const imageRef = useRef<HTMLInputElement>(null)
  const trailNameRef = useRef<HTMLInputElement>(null)

  const photoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.log("no files selected")
      return
    }
    console.log(e.target.files[0].name)

    setState({ ...state, displayURL: URL.createObjectURL(e.target.files[0]), loading: "", lat: null, lng: null })
  }

  console.log("imageRef", imageRef)

  const uploadPhoto = async () => {
    setState({ ...state, loading: "loading" })
    if (!import.meta.env.VITE_APIGATEWAY_NAME) {
      console.log("no env")
      return
    }
    if (!imageRef.current || !imageRef.current.files) {
      console.log("no image")
      return
    }
    if (!state.lat || !state.lng) {
      console.log("no location")
      return
    }
    const uuid = v4()
    const fileType = imageRef.current.files[0].name.split(".").pop()
    const uuidWfileType = uuid + "." + fileType
    const paramsBody: PostPhotoParams = {
      id: uuidWfileType,
      latLng: {
        lat: state.lat,
        lng: state.lng,
      },
    }
    if (trailNameRef.current && trailNameRef.current.value) {
      paramsBody.trailName = trailNameRef.current.value
    }
    console.log(uuidWfileType)
    try {
      const sendToDB = API.post(
        import.meta.env.VITE_APIGATEWAY_NAME,
        "/savePhotoData",
        {
          body: paramsBody,
        }
      )
      const sendToS3 = Storage.put(uuidWfileType, imageRef.current.files[0])
      await Promise.all([sendToS3, sendToDB])
      setState({ ...state, loading: "success" })
    } catch (err) {
      console.log("err", err)
      setState({ ...state, loading: "failed" })
    }
  }

  const updateLocation = ({ lat, lng }: { lat: number; lng: number }) => {
    setState({ ...state, lat: lat, lng: lng })
  }

  console.log("state", state)

  return (
    <div>
      <div className="flex flex-col mt-6">
        <div className="flex justify-center">
          <div className="flex flex-col">
            <div className="h-64 w-64 -mb-10 ml-10">
              <img src={state.displayURL} />
            </div>
            <input
              onChange={(e) => photoSelected(e)}
              type="file"
              className="bg-gray-100 rounded py-1 px-3 m-1"
              ref={imageRef}
            ></input>
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
            <div className="h-80 w-80 mt-10">
              <GoogleMapUpload updateLocation={updateLocation} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <button
          onClick={() => uploadPhoto()}
          className="font-normal mb-10 m-1 py-1 px-3 hover:bg-blue-100 rounded outline-1 bg-blue-50 outline outline-blue-700"
        >
          Upload Photo
        </button>
        {state.loading === "loading" && (
          <div className="flex flex-col mt-10">
            <Spinner className="flex justify-center" />
          </div>
        )}
        {state.loading === "success" && <div>Successfully uploaded</div>}
      </div>

      <div className="card"></div>
    </div>
  )
}
