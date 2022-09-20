import { API } from "aws-amplify"
import { GuessLocationReturn } from "./types"

interface UserLevels {
  id: string | null
  levels: {}
}
interface LevelData {
  level: string
  images: {
    id: string
    url: string
  }[]
}
interface PostPhotoParams {
  id: string
  trailName?: string
  latLng: {
    lat: number
    lng: number
  }
  userId?: string
}

const apiGateway = import.meta.env.VITE_APIGATEWAY_NAME

export async function getUserGames(): Promise<UserLevels> {
  try {
    return await API.get(apiGateway, "/getUserGames", {})
  } catch (err) {
    return {
      id: null,
      levels: {},
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
  level,
}: {
  latLng: google.maps.LatLng
  id: string
  level: string
}): Promise<GuessLocationReturn> {
  const shit = await API.post(apiGateway, "/guessLocation", {
    body: {
      latLng: latLng,
      id: id,
      level: level,
    },
  })
  console.log("shit", shit)
  return shit
}

export async function newGame({
  level,
  photoId,
}: {
  level: string
  photoId: string
}): Promise<void> {
  await API.post(apiGateway, "/newGame", {
    body: {
      level: level,
      id: photoId,
    },
  })
}

export async function uploadPhotoData(
  uploadPhotoData: PostPhotoParams
): Promise<string> {
  try {
    await API.post(apiGateway, "/savePhotoData", {
      body: uploadPhotoData,
    })
    return "success"
  } catch (err) {
    console.log("err", err)
    return "failed"
  }
}

export async function saveEmail(email: string): Promise<string> {
  try {
    await API.post(apiGateway, "/submitEmail", {
      body: email,
    })
    return "success"
  } catch (err) {
    console.log("err", err)
    return "failed"
  }
}
