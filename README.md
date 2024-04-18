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

  return;
  <LMap>
    <LCircleMarker latlng={tokyo} />
    <LMarker latlng={tokyo} />
  </LMap>;
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
