import { API } from "aws-amplify"
import { GuessLocationReturn } from "./types"

interface UserLevels {
  id: string | null
  levels: string[]
}
interface LevelData {
  level: string
  images: {
    id: string
    url: string
  }[]
}

const apiGateway = import.meta.env.VITE_APIGATEWAY_NAME

export async function getUserGames(): Promise<UserLevels> {
  try {
    return await API.get(apiGateway, "/getUserGames", {})
  } catch (err) {
    return {
      id: null,
      levels: [],
    }
  }
}

export async function retrieveLevel(
  level: string
): Promise<LevelData | undefined> {
  const params = { body: { level: level } }
  return await API.post(apiGateway, "/retrieveLevel", params)
}

export async function saveUserGame(level: string): Promise<void | undefined> {
  try {
    const params = { body: { level: level } }
    return await API.post(apiGateway, "/saveUserGame", params)
  } catch (err) {
    console.log(err)
  }
}

export async function guessRes({
  latLng,
  id,
}: {
  latLng: google.maps.LatLng
  id: string
}): Promise<GuessLocationReturn> {
  return await API.post(import.meta.env.VITE_APIGATEWAY_NAME, "/guessLocation", {
    body: {
      latLng: latLng,
      id: id
    }
  })
}
