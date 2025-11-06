"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { location } from "@/lib/dummydata";

const Location = () => {
  return (
    <div className="mt-6 xs:mt-8 sm:mt-10 md:mt-12">
      {/* Header */}
      <h3 className="text-lg xs:text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text mb-3 xs:mb-4">
        Our Location
      </h3>

      {/* Map Container */}
      <div className="aspect-video w-full overflow-hidden rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <APIProvider apiKey={location.apiKey}>
          <Map
            center={location.position}
            zoom={15}
            mapId={"concept-builders-map"}
            gestureHandling={"greedy"}
            disableDefaultUI={false}
            fullscreenControl={true}
            zoomControl={true}
          >
            <Marker position={location.position} />
          </Map>
        </APIProvider>
      </div>

      {/* Directions Button */}
      <div className="mt-4 xs:mt-5 text-center">
        <a
          href={location.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 xs:px-6 py-2.5 xs:py-3 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white font-semibold rounded-lg xs:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm xs:text-base min-h-[2.75rem] xs:min-h-[3rem]"
        >
          <svg
            className="w-4 h-4 xs:w-5 xs:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          Get Directions
        </a>
      </div>

      {/* Address - Mobile Only */}
      <div className="xs:hidden mt-3 text-center">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Tap for directions to our office
        </p>
      </div>
    </div>
  );
};

export default Location;
