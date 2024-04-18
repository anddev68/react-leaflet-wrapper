import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { LMapProvider } from "../contexts/LMapProvider";
import L from "leaflet";

type Props = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /**
   * It can be used for only initialization.
   * Use MapContainer for updating a center of map dynamically.
   */
  initialCenter: L.LatLngExpression;
  /**
   * It can be used for only initialization.
   * Use MapContainer for updating a zoom of map dynamically.
   */
  initialZoom?: number;
};

/**
 * Leaftlet map wrapper.
 *
 * @example
 * <Map initialCenter={tokyo} >
 *  // Put LMarker, LCircleMarker, ...,
 * </Map>
 */
export function LMap(props: Props) {
  const { children, className, style, initialCenter, initialZoom } = props;

  // We use useState intead of useRef because map's children should be re-rendered when it was upadated.
  const [mapState, setMapState] = useState<L.Map | null>(null);

  // We use a ref-callback-function for map initialization.
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    console.debug("map was initialized.");

    if (!node) {
      return;
    }

    // Add osm
    const map = L.map(node).fitWorld();
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Set initial view
    map.setView(initialCenter, initialZoom);

    // Connect with React.
    setMapState(map);

    // The deps are empty because containerRef shoudle be initialized only once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remove a map for next rendering.
  useEffect(() => {
    return () => {
      console.log("map was cleaned up.");
      mapState?.remove();
    };
  }, [mapState]);

  // When a map is initialized, its children can be re-rendered because mapState was made by useState.
  return (
    <div style={style} className={className} ref={containerRef}>
      {mapState && <LMapProvider map={mapState}>{children}</LMapProvider>}
    </div>
  );
}
