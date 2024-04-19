# react-leaflet-wrapper

Simple and lisence-free leaflet wrapper for React.

This is under construction, so do not use for production.

## Quick Start

At first, install dependencies.

```
pnpm install @anddev68/react-leaflet-wrapper # no packages now. plasease wait.
```

Next, write your code. For example,

```tsx
// Map.tsx
export function Map() {
  const tokyo = [35.689, 139.692];

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <LMap initialCenter={tokyo} style={{ position: "absolute", inset: "0" }}>
        <LMarker
          latlng={tokyo}
          popupContent={<div>popupContent</div>}
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
}
```

Finally, do not forget to import the leaflet css.
We show an example in Next.js (App Router) bellow.

```tsx
// layout.tsx
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  //
};
```

## For Developers

```
bun install
bun run storybook
```

```
bun run build
```
