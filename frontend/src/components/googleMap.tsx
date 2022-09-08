import * as React from "react"
import { Wrapper, Status } from "@googlemaps/react-wrapper"
import GoogleMapChild from "./googleMapChild"
import { API } from "@aws-amplify/api"

import { GuessLocationReturn, LatLng } from "../lib/types"

const render = (status: Status) => {
  return <h1>{status}</h1>
}

const GoogleMap = ({
  click,
  marker,
  actualData
}: {
  click: (e: google.maps.MapMouseEvent) => void
  marker: any
  actualData: GuessLocationReturn | undefined
}) => {

  const [zoom, setZoom] = React.useState(2) // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  })

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle")
    /*below was undefined ?*/
    setZoom(m.getZoom()!)
    setCenter(m.getCenter()!.toJSON())
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
          onClick={click}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          <Marker position={marker} />
          {actualData && <Marker position={actualData.actualLocation} />}
        </GoogleMapChild>
      </Wrapper>

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
