
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

export interface LevelObj {
  level: string
  images: {
    id: string
    url: string
  }[]
}
export interface LevelsMap {
  [level: string]: {
    id: string
    url: string
    blurryUrl: string
    thumbnailUrl: string
  }[]
}

export interface UserData {
  id: string
  levels: { [id: string]: { [id: string]: string } }
}

export interface CompletedLevels {
  [level: string]: Record<string, any>
}

export interface UserLevels {
  id: string | null
  levels: {}
}