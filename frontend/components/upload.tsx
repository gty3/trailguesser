import React, { useRef, useState } from "react"
import { Storage, API } from "aws-amplify"
import { v4 } from "uuid"
import Spinner from "../components/spinner"
interface State {
  loading: boolean
  messengerAddress?: string
}

export default function Upload() {
  const [state, setState] = useState<State>({
    loading: false,
  })

  const imageRef = useRef<HTMLInputElement>(null)
  const trailNameRef = useRef<HTMLInputElement>(null)

  const photoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.log("no files selected")
      return
    }
    console.log(e.target.files[0].name)
  }

  const uploadPhoto = async () => {
    if (!import.meta.env.VITE_APIGATEWAY_NAME ) { console.log('no env'); return }
    if (!imageRef.current || !imageRef.current.files) { console.log("no image"); return }
    if (!trailNameRef.current || !trailNameRef.current.value) { console.log('no trail name'); return }
   
    const uuid = v4()
    const fileType = imageRef.current.files[0].name.split('.').pop()
    const uuidWfileType = uuid + '.' + fileType
    console.log(uuidWfileType)
    try {
      const sendToDB = API.post(import.meta.env.VITE_APIGATEWAY_NAME,
          "/savePhotoData",
          {
            body: { id: uuidWfileType, trailName: trailNameRef.current.value },
          })
      const sendToS3 = Storage.put(uuidWfileType, imageRef.current.files[0])
      const [dbRes, s3Res] = await Promise.all([sendToS3, sendToDB])

      console.log('#####promise res', dbRes, s3Res)

      setState({ ...state, loading: true })
      setState({ ...state, loading: false, messengerAddress: "" })
    } catch (err) {
      console.log("err", err)
    }
  }
  
  return (
    <div>
      <div className="flex flex-col mt-44">
        <div className="flex justify-center">
          <input
            onChange={(e) => photoSelected(e)}
            type="file"
            className="bg-gray-100 rounded py-1 px-3 m-1"
            ref={imageRef}
          ></input>
        </div>
        <div className=" mt-10 flex justify-center">
          <input
            type="text"
            placeholder="Trail name"
            className="bg-gray-100 rounded py-1 px-3 m-1"
            ref={trailNameRef}
          ></input>
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <button
          onClick={() => uploadPhoto()}
          className="font-normal m-1 py-1 px-3 hover:bg-blue-100 rounded outline-1 bg-blue-50 outline outline-blue-700"
        >
          Upload Photo
        </button>
        {/* <div className="flex flex-col mt-10">
      <Spinner className="flex justify-center" />
    </div> */}
      </div>

      <div className="card"></div>
    </div>
  )
}
