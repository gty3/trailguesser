import { API, Auth } from "aws-amplify"
import React, { useEffect, useState } from "react"
import AdminLevels from "../components/adminLevels"
import "../configureAmplify"
import { LevelState } from "../lib/types"

interface PhotoState {
  id: string
  imgUrl: string
  time: number
}


export default function Admin() {
  const [photoState, setPhotoState] = useState<PhotoState[]>()
  const [authState, setAuthState] = useState(false)
  const [levelsState, setLevels] = useState<LevelState[]>()
  const [pageState, setPageState] = useState("")

  const getPhotos = async () => {
    const allPhotos = await API.get(
      import.meta.env.VITE_APIGATEWAY_NAME,
      "/getAllPhotos",
      {}
    )
    setPhotoState(allPhotos)
  }
  const getLevels = async () => {
    const levels = await API.get(
      import.meta.env.VITE_APIGATEWAY_NAME,
      "/adminGetLevels",
      {}
    )
      console.log('levels', levels)
    setLevels(levels)
  }

  const getUserLevels = async () => {
    const userLevels = await API.get(
      import.meta.env.VITE_APIGATEWAY_NAME,
      "/adminGetUserGames",
      {}
    )
    console.log("gottenUserLevels", userLevels)
    // setLevels(userLevels)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const user = await Auth.currentAuthenticatedUser()
        console.log("user", user)
        await getLevels()
        await getPhotos()
        
        // const userLevels = await getUserLevels()

        // console.log("userLevels", userLevels)
        setAuthState(true)
      } catch (err) {
        console.log(err)
        setAuthState(false)
      }
    })()
  }, [])

  if (!authState) {
    return <div className="flex justify-center mt-40">Access denied</div>
  } else if (pageState === "users") {

    // console.log("userDataState", levelsState)
    return (
      <div>
        {levelsState?.map((user) => (
          <div key={user.level}>{JSON.stringify(user.images)}</div>
        ))}
      </div>
    )
  } else if (levelsState) {
    return (
      <div>
        <AdminLevels levelsState={levelsState}/>
        (
        {photoState?.map((photo) => (
          <div className="m-10" id={photo.id}>
            <div>{photo.id}</div>
            <div>{"" + photo.time}</div>
            <img
              className="h-80 object-scale-down items-start"
              src={photo.imgUrl}
            ></img>
          </div>
        ))}
      </div>
    )
  } else {
    return (
      <div className="">
        <div>
          <button onClick={() => setPageState("photos")} className="text-lg bg-gray-500">
            Photos
          </button>
          <button onClick={() => setPageState("users")} className="">
            UserLevels
          </button>
        </div>
        <div className="">?</div>
      </div>
    )
  }
}
