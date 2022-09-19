import { API, Auth } from "aws-amplify"
import React, { useEffect, useState } from "react"
import LogIn from "../components/login"
import "../configureAmplify"

interface PhotoState {
  id: string
  imgUrl: string
}
interface UserData {
  id: string
  levels: { [id: string]: { [id: string]: string } }
}

export default function Admin() {
  const [photoState, setPhotoState] = useState<PhotoState[]>()
  const [authState, setAuthState] = useState(false)
  const [userDataState, setUserDataState] = useState<UserData[]>()

  const loggedIn = async () => {
    setAuthState(true)
    // const allPhotos = await API.get(
    //   import.meta.env.VITE_APIGATEWAY_NAME,
    //   "/getAllPhotos",
    //   {}
    // )
    // setPhotoState(allPhotos)
  }

  const getPhotos = async () => {
    const allPhotos = await API.get(
      import.meta.env.VITE_APIGATEWAY_NAME,
      "/getAllPhotos",
      {}
    )
    console.log("allPhoots", allPhotos)
    setPhotoState(allPhotos)
  }

  const getUserLevels = async () => {
    const userLevels = await API.get(
      import.meta.env.VITE_APIGATEWAY_NAME,
      "/adminGetUserGames",
      {}
    )
    console.log(userLevels)
    setUserDataState(userLevels)
    
  }

  // useEffect(() => {
  //   ;(async () => {
  //     try {
  //       const user = await Auth.currentAuthenticatedUser()
  //       console.log("user", user)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   })()
  // }, [])

  if (!authState) {
    return (
      <div className="flex justify-center mt-40">
        <LogIn loggedIn={loggedIn} />
      </div>
    )
  } else if (userDataState) {
    return (
      <div>{userDataState.map((user) => (<div key={user.id} >{JSON.stringify(user.levels)}</div>))}</div>
    )
  } else {
    return (
      <div className="">
        {photoState ? (
          photoState.map((photo) => (
            <div id={photo.id}>
              {photo.id}
              <img className="h-80" src={photo.imgUrl}></img>
            </div>
          ))
        ) : (
          <div>
            <button onClick={getPhotos} className="text-lg bg-gray-500">
              Photos
            </button>
            <button onClick={getUserLevels} className="">
              UserLevels
            </button>
          </div>
        )}
        <div className="">?</div>
      </div>
    )
  }
}
