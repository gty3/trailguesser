
export interface LatLng {
  lat: number
  lng: number
}

export interface Image {
  uuid: string
  thumbnailUrl?: string
  file?: File
}

export interface GuessLocationReturn {
  guessLocation?: LatLng
  actualLocation: LatLng
  distance: number
  points: number
  center: LatLng
  zoom: number
}

export interface LevelState {
  level: string
  images: {
    id: string
    url: string
  }[]
}

export interface UserData {
  id: string
  levels: { [id: string]: { [id: string]: string } }
}