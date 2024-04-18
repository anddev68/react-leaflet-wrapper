import { useEffect } from "react";
import { useMap } from "../contexts/LMapProvider";
import L from "leaflet";

type Props = {
  latlng: L.LatLngExpression;
  options?: L.CircleMarkerOptions;
};

/**
 * Leaflet CircleMarker wrapper.
 *
 * @example
 * <LMap>
 *   <LCircleMarler latlng={latlng} />
 * </LMap>
 */
export function LCircleMarker(props: Props) {
  const { options, latlng } = props;

  // Use map's context
  const map = useMap();

  useEffect(() => {
    console.debug("[LCircleMarker] useEffect");

    // FIXME: Reuse instance.
    // Always make a new instance whether first rendering or not.
    const marker = L.circleMarker(latlng, options).addTo(map);

    return () => {
      marker.off();
      marker.remove();
    };
  }, [map, latlng, options]);

  return null;
}
