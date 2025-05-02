import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Polyline,
} from "@react-google-maps/api";
import { FaBus, FaMapMarkerAlt } from "react-icons/fa";

const BusRouteMap = ({ route }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 7.8731, lng: 80.7718 }); // Default center of Sri Lanka
  const [zoom, setZoom] = useState(9);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);

  // Set up Google Maps API
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // You need to provide this in your .env file
  });

  useEffect(() => {
    if (route && route.coordinates) {
      // Convert coordinates from [lat, lng] array format to {lat, lng} object format
      const formattedCoordinates = route.coordinates.map((coord) => ({
        lat: coord[0],
        lng: coord[1],
      }));

      setPathCoordinates(formattedCoordinates);

      // If coordinates exist, center the map on the first coordinate
      if (formattedCoordinates.length > 0) {
        setMapCenter(formattedCoordinates[0]);
        setZoom(12);
      }
    }
  }, [route]);

  // Custom marker icons
  const startIcon = {
    path: "M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z",
    fillColor: "#007BFF",
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 1.5,
    anchor: { x: 12, y: 24 },
  };

  const endIcon = {
    path: "M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z",
    fillColor: "#28a745",
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 1.5,
    anchor: { x: 12, y: 24 },
  };

  const stopIcon = {
    path: "M0 0h24v24H0z M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z",
    fillColor: "#6c757d",
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 1,
    anchor: { x: 12, y: 12 },
  };

  // If no route provided or no coordinates, show a message
  if (
    !isLoaded ||
    !route ||
    !route.coordinates ||
    route.coordinates.length === 0
  ) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 text-center">
        <p className="text-darkGray">
          {!isLoaded
            ? "Loading map..."
            : "Map data is not available for this route."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-2 h-96">
      <GoogleMap
        mapContainerStyle={{
          height: "100%",
          width: "100%",
          borderRadius: "0.5rem",
        }}
        center={mapCenter}
        zoom={zoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Route line */}
        <Polyline
          path={pathCoordinates}
          options={{
            strokeColor: "#007BFF",
            strokeWeight: 4,
            strokeOpacity: 0.7,
          }}
        />

        {/* Start point marker */}
        <Marker
          position={pathCoordinates[0]}
          icon={startIcon}
          onClick={() =>
            setSelectedStop({
              position: pathCoordinates[0],
              name: route.startPoint,
              isStartPoint: true,
            })
          }
        />

        {/* End point marker */}
        <Marker
          position={pathCoordinates[pathCoordinates.length - 1]}
          icon={endIcon}
          onClick={() =>
            setSelectedStop({
              position: pathCoordinates[pathCoordinates.length - 1],
              name: route.endPoint,
              isEndPoint: true,
            })
          }
        />

        {/* Stop markers */}
        {route.stops &&
          route.stops.map((stop, index) => {
            // Skip first and last stops as they are already marked
            if (index === 0 || index === route.stops.length - 1) return null;

            // Only show marker if stop has coordinates
            if (!stop.coordinates) return null;

            // Convert stop coordinates to Google Maps format
            const position = {
              lat: stop.coordinates[0],
              lng: stop.coordinates[1],
            };

            return (
              <Marker
                key={index}
                position={position}
                icon={stopIcon}
                onClick={() =>
                  setSelectedStop({
                    position,
                    name: stop.name,
                    time: stop.time,
                    index,
                  })
                }
              />
            );
          })}

        {/* Info Window for selected stop */}
        {selectedStop && (
          <InfoWindow
            position={selectedStop.position}
            onCloseClick={() => setSelectedStop(null)}
          >
            <div>
              {selectedStop.isStartPoint ? (
                <strong>Start: {selectedStop.name}</strong>
              ) : selectedStop.isEndPoint ? (
                <strong>End: {selectedStop.name}</strong>
              ) : (
                <>
                  <strong>Stop {selectedStop.index + 1}: </strong>{" "}
                  {selectedStop.name}
                  {selectedStop.time && (
                    <div>
                      <strong>Time:</strong> {selectedStop.time}
                    </div>
                  )}
                </>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default BusRouteMap;
