import * as React from "react"
import { Wrapper, Status } from "@googlemaps/react-wrapper"
import GoogleMapChild from "./googleMapChild"
import { API } from "@aws-amplify/api"
import { LatLng } from "../lib/types"

const render = (status: Status) => {
  return <h1>{status}</h1>
}

const GoogleMapUpload = ({ updateLocation, state }: any) => {

  const latLng = state.lat ? { lat: state.lat, lng: state.lng } : undefined
  // const [marker, setMarker] = React.useState<LatLng>({
  //   lat: state.lat,
  //   lng: state.lng,
  // })
  const [zoom, setZoom] = React.useState(2) // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 38.91090486163843,
    lng: -102.39783924737546,
  })

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    // setMarker({ lat: e.latLng?.lat()!, lng: e.latLng?.lng()! })
    updateLocation({ lat: e.latLng?.lat(), lng: e.latLng?.lng() })
  }

  const onIdle = (m: google.maps.Map) => {
    console.log("onIdle")
    /*below is undefined ?*/
    // setZoom(m.getZoom()!)
    // setCenter(m.getCenter()!.toJSON())
  }
  console.log("state", state)
  // console.log("marker", marker)

  return (
    <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS} render={render}>
      <GoogleMapChild
        clickableIcons={false}
        mapTypeControl={false}
        streetViewControl={false}
        gestureHandling={"greedy"}
        center={center}
        onClick={onClick}
        onIdle={onIdle}
        zoom={zoom}
        style={{ flexGrow: "1", height: "100%" }}
      >
        <Marker position={latLng} />
      </GoogleMapChild>
    </Wrapper>
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

export default GoogleMapUpload
