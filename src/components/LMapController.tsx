import { useEffect } from "react";
import { useMap } from "../contexts/LMapProvider";

type Props = {
  center: L.LatLngExpression;
  /**
   * If true, map.locate().
   */
  locate?: boolean;
};

/**
 * @param center
 *  A center of map move to here.
 *
 * @example
 * <LMap>
 *   <LMapController center={center} />
 * </LMap>
 */
export function LMapController(props: Props) {
  const map = useMap();
  const { center } = props;

  useEffect(() => {
    map.setView(center);
  }, [map, center]);

  return null;
}
