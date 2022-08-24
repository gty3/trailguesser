
import * as React from "react"
import { Wrapper, Status } from "@googlemaps/react-wrapper"
import GoogleMapChild from './googleMapChild'

const render = (status: Status) => {
  return <h1>{status}</h1>
}

export default function GoogleMap() {
  const [marker, setMarker] = React.useState<google.maps.LatLng>()
  const [zoom, setZoom] = React.useState(0) // initial zoom
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

  return (
    <div className="h-44 w-44 hover:h-1/2 hover:w-1/2 absolute bottom-10 right-0">
      <Wrapper
        apiKey={import.meta.env.VITE_GOOGLE_MAPS}
        render={render}
      >
        <GoogleMapChild
        gestureHandling={"greedy"}
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom={zoom}
          style={{ flexGrow: "1", height: "100%" }}
        >
            <Marker position={marker} />
        </GoogleMapChild>
      </Wrapper>
      {/* Basic form for controlling center and zoom of map. */}
      {/* {form} */}
    </div>
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


