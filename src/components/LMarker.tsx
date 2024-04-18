import { ReactNode, useEffect, useState } from "react";
import { useMap } from "../contexts/LMapProvider";
import L from "leaflet";
import { createPortal } from "react-dom";

type Props = {
  latlng: L.LatLngExpression;
  options?: L.MarkerOptions;
  onClick?: () => void;
  /**
   * Show this when marker is clicked.
   */
  popupContent?: ReactNode;
  /**
   * popup's options
   */
  popupOptions?: L.PopupOptions;
};

export function LMarker(props: Props) {
  const { onClick, latlng, options, popupContent, popupOptions } = props;
  const map = useMap();

  // For re-rendering, useState instead of useRef.
  const [container, setContainer] = useState<HTMLElement | undefined>(
    undefined
  );

  useEffect(() => {
    console.debug("[LMarker] useEffect was called.");

    // FIXME: Resuse an instance.
    // Always make a new instance whether first rendering or not.
    const marker = L.marker(latlng, options).addTo(map);
    marker.on("click", () => {
      onClick?.();
    });

    if (popupContent) {
      const popup = L.popup({
        content: L.DomUtil.create("div"),
        ...popupOptions,
      });
      marker.bindPopup(popup);
      setContainer(popup.getContent() as HTMLElement);
    }

    // Clean up for next re-rendering.
    return () => {
      console.debug("[LMarker] useEffect cleanup was called.");
      marker.off();
      marker.remove();
    };
  }, [map, latlng, options, popupContent, popupOptions, onClick]);

  console.log(popupContent, container);

  // popupContent should be rendered by react, but marker should not.
  if (!container || !popupContent) {
    return null;
  }
  return createPortal(popupContent, container);
}
