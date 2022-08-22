import { API } from "aws-amplify"
import React, { useEffect, useState } from "react"
import "../src/index.css"
import Spinner from "./spinner"
export default function Play() {
  const [state, setState] = useState()

  useEffect(() => {
    (async () => {
      const image = await API.get(import.meta.env.VITE_APIGATEWAY_NAME, '/getTrailPhoto', {})
      console.log('return IMAGE', image)
    })()
  }, [])

  return (
    <div className="bg-yellow-700 h-screen">
      <div className="flex justify-center pt-40">
        hello
        <div>{!state && <Spinner />}</div>
      </div>
    </div>
  )
}
