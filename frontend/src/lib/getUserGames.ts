import { API } from "aws-amplify"
import { useEffect } from "react"

export default function () : string | undefined {
  let lastLevelCompleted
  useEffect(() => {
    ;(async () => {
      lastLevelCompleted = await API.get(import.meta.env.VITE_APIGATEWAY_NAME, "/getUserGames", {})
      console.log("lastLevelCompleted", lastLevelCompleted)
    })()
  }, [])

  return lastLevelCompleted
}
