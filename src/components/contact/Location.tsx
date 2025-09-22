
"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const Location = () => {
  const position = { lat: -0.303043, lng: 36.059429 };
  const destination = "Concept+Builders";
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`;


  return (
    <div className="mt-8 md:mt-12">
      <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
        Our Location
      </h3>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg">
        <APIProvider apiKey={"AIzaSyA4LjOh_5kbr4YzACmeRUaFwcr5-JV10q4"}>
          <Map center={position} zoom={15} mapId={"concept-builders-map"}>
            <Marker position={position} />
          </Map>
        </APIProvider>
      </div>
      <div className="mt-4 text-center">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105"
        >
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default Location;
