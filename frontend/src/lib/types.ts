
export interface LatLng {
  lat: number
  lng: number
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