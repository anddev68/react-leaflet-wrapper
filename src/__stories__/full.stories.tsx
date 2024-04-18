import type { Meta, StoryObj } from "@storybook/react";
import { LMap } from "../components/LMap";

// It must be included when using leafet.
import "leaflet/dist/leaflet.css";
import { LAT_LNG_OSAKA, LAT_LNG_TOKYO } from "./constants";
import { LLocateControl } from "../components/LLocateControl";
import { LCircleMarker } from "../components/LCircleMarker";
import { useState } from "react";
import { LatLngExpression } from "leaflet";
import { LMarker } from "../components/LMarker";

/*
const latlng = LAT_LNG_TOKYO;

// mocking geolocation

global.navigator.geolocation.watchPosition = (success: PositionCallback) => {
  const updater = () => {
    latlng.lat = latlng.lat - 0.001;
    latlng.lng = latlng.lng - 0.001;

    success({
      coords: {
        accuracy: 0,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        latitude: latlng.lat,
        longitude: latlng.lng,
        speed: 0,
      },
      timestamp: 0,
    });
  };
  setInterval(updater, 3000);
  return 0;
};
*/

const meta = {
  title: "examples/full",
  component: undefined,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  args: {},
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => {
    const [latlng, setLatLng] = useState<LatLngExpression | undefined>(
      undefined
    );

    return (
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <LMap
          initialCenter={LAT_LNG_TOKYO}
          style={{ position: "absolute", inset: "0" }}
        >
          <LMarker
            latlng={LAT_LNG_OSAKA}
            popupContent={<div>test</div>}
            onClick={() => {
              console.log("onclick marker");
            }}
          />
          <LLocateControl
            onLocationFound={(e) => {
              console.log(e);
              setLatLng(e.latlng);
            }}
            onLocationError={(ev) => {
              console.log(ev);
            }}
            icons={{
              activated: <div>activated</div>,
              idle: <div>idle</div>,
              activating: <div>activating</div>,
              error: <div>error</div>,
              following: <div>following</div>,
            }}
          />
          {latlng && <LCircleMarker latlng={latlng} />}
        </LMap>
      </div>
    );
  },
};
