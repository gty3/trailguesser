import * as React from "react"
import { Wrapper, Status } from "@googlemaps/react-wrapper"
import GoogleMapChild from "./googleMapChild"
import { API } from "@aws-amplify/api"

const render = (status: Status) => {
  return <h1>{status}</h1>
}

const GoogleMap = ({
  imageId,
  nextPhoto,
}: {
  imageId: string
  nextPhoto: any
}) => {
  const [guessed, setGuessed] = React.useState(false)
  const [actualPosition, setActualPosition] = React.useState(null)
  const [marker, setMarker] = React.useState<google.maps.LatLng>()
  const [zoom, setZoom] = React.useState(1) // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  })

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setMarker(e.latLng!)
  }

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle")
    /*below is undefined ?*/
    // setZoom(m.getZoom()!)
    // setCenter(m.getCenter()!.toJSON())
  }

  const submitGuess = async () => {
    setGuessed(true)
    const params = {
      body: {
        latLng: marker,
        id: imageId,
      },
    }
    const guessRes = await API.post(
      import.meta.env.VITE_APIGATEWAY_NAME,
      "/guessLocation",
      params
    )
    if (!guessRes.actualLocation) {
      throw "wtf, no image location"
    }
    setActualPosition(guessRes.actualLocation)
    console.log("guessRes", guessRes)
  }

  const nextImage = () => {
    nextPhoto()
    setActualPosition(null)
    setMarker(undefined)
  }

  return (
    <>
      <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS} render={render}>
        <GoogleMapChild
          clickableIcons={false}
          streetViewControl={false}
          mapTypeControl={false}
          gestureHandling={"greedy"}
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          <Marker position={marker} />
          {guessed && <Marker position={actualPosition} />}
        </GoogleMapChild>
      </Wrapper>
      {actualPosition ? (
        <button onClick={nextImage} className="p-1 m-1 bg-green-400 w-full">
          Next trail!
        </button>
      ) : (
        <button onClick={submitGuess} className="w-full p-1 m-1 bg-blue-400">
          Guess!
        </button>
      )}
    </>
  )
}

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>()

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker())
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options)
    }
  }, [marker, options])

  return null
}

export default GoogleMap
