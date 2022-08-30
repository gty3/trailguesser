import { API, Auth } from "aws-amplify"
import React, { useEffect, useState } from "react"
import LogIn from "../components/login"
import '../configureAmplify'

interface PhotoState {
  id: string
  imgUrl: string
}

export default function Admin() {
  const [photoState, setPhotoState] = useState<PhotoState[]>([])
  const [authState, setAuthState] = useState(false)

  const loggedIn = async () => {
    setAuthState(true)
    const allPhotos = await API.get(
      import.meta.env.VITE_APIGATEWAY_NAME,
      "/getAllPhotos",
      {})
      setPhotoState(allPhotos)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const user = await Auth.currentAuthenticatedUser()
        console.log('user', user)
        const allPhotos = await API.get(
          import.meta.env.VITE_APIGATEWAY_NAME,
          "/getAllPhotos",
          {}
        )
        console.log("allPhoots", allPhotos)
        setPhotoState(allPhotos)
      } catch (err) {
        console.log(err)
      }

    })()
  }, [])

  return (
    <div className="">
      {!authState && <div className="flex justify-center mt-40">
        <LogIn loggedIn={loggedIn}/>
        </div>}
      {photoState &&
        photoState.map((photo) => (
          <div id={photo.id}>
            {photo.id}
            <img className="h-80" src={photo.imgUrl}></img>
          </div>
        ))}
      <div className=""></div>
    </div>
  )
}
