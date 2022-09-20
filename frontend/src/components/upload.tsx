import React, { useRef, useState } from "react"
import { Auth, Storage } from "aws-amplify"
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
    
    setState({
      ...state,
      displayURL: URL.createObjectURL(e.target.files[0]),
      loading: "",
      s3Loading: true,
      uuid: uuid,
      error: "",
      // lat: null,
      // lng: null,
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
    if (!imageRef.current?.files || (imageRef.current?.files && imageRef.current?.files?.length === 0)) {
      console.log("no image")
      setState({ ...state, error: "No file detected, try again" })
      return
    }
    if (!state.lat || !state.lng) {
      setState({ ...state, error: "Drop a pin of the photo location" })
      return
    }
    let user
    try {
      const auth = await Auth.currentAuthenticatedUser()
      user = auth.username
    } catch {
      const unauth = await Auth.currentUserCredentials()
      user = unauth.identityId
    }
    console.log("userId", user)
    setState({ ...state, loading: "loading" })
    const fileType = imageRef.current.files[0].name.split(".").pop()
    const uuidWfileType = state.uuid + "." + fileType

    const successString = await uploadPhotoData({
      id: uuidWfileType,
      latLng: {
        lat: state.lat,
        lng: state.lng,
      },
      trailName: trailNameRef.current?.value,
      ...(user && { userId: user }),
    })
    setState({
      loading: successString,
      lat: null,
      lng: null,
      s3Loading: false,
      error: "",
      uuid: "",
    })
    imageRef.current.value = ""
    if (trailNameRef.current) trailNameRef.current.value = ""

  }

  console.log('imageRef', imageRef)

  const updateLocation = ({ lat, lng }: { lat: number; lng: number }) => {
    setState({ ...state, lat: lat, lng: lng })
  }
  
  return (
    <div className="">
      <div className="flex flex-col">
        <div className="flex justify-center">
          <div className="flex flex-col ">
            <div className="h-64 w-screen md:w-96 mt-2 flex justify-center">
              <img className="h-64" src={state.displayURL} />
            </div>
            <div className="flex justify-center">
              <input
                id="file-upload"
                onChange={(e) => photoSelected(e)}
                type="file"
                className="bg-blue-100 rounded py-1 px-3 m-1 w-80 text-lg text-slate-700"
                ref={imageRef}
              ></input>
            </div>
          </div>
        </div>
        <div className=" mt-2">
          <div className="flex flex-col items-center">
            <input
              type="text"
              placeholder="Trail name, leave blank if unknown"
              className="bg-blue-100 rounded py-1.5 px-3 m-3 placeholder-slate-600 w-80 text-lg"
              ref={trailNameRef}
            ></input>
            <div className="w-screen h-80 md:w-96 mt-2">
              <div className="mb-2 flex justify-center">
                Drop a pin of the photo location
              </div>

              <GoogleMapUpload state={state} updateLocation={updateLocation} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <div className="flex flex-col">

          {state.loading === "success" ? (
            <div className="mt-10 text-lg">Successfully uploaded, select another file</div>
          ) : state.loading === "loading" ? (
            <div className="flex flex-col mt-10">
              <Spinner className="flex justify-center" />
            </div>
          ) : (
            <button
              onClick={() => uploadPhoto()}
              className="flex bg-blue-600 mt-6 text-white justify-center p-1.5 cursor-pointer rounded-md px-3 text-2xl text-thin"
            >
              Upload Photo
            </button>
          )}
          <div className="mt-1.5 text-lg">{state.error}</div>
        </div>
      </div>

      <div className="card"></div>
    </div>
  )
}
