import * as React from "react"
import { Wrapper, Status } from "@googlemaps/react-wrapper"
import GoogleMapChild from "../googleMapChild"
import { API } from "@aws-amplify/api"

import { GuessLocationReturn, LatLng } from "../../lib/types"

const render = (status: Status) => {
  return <h1>{status}</h1>
}

const GoogleMapGuessed = ({
  marker,
  actualData
}: {
  marker: any
  actualData: GuessLocationReturn
}) => {

  const [zoom, setZoom] = React.useState(1)
  const [center, setCenter] = React.useState<LatLng>(actualData.center)

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle")
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
          onIdle={onIdle}
          zoom={actualData.zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
          <Marker position={marker} />
          <Marker position={actualData.actualLocation} />
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

export default GoogleMapGuessed
