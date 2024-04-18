import L from "leaflet";
import { ReactNode, useEffect, useState } from "react";
import { useMap } from "../contexts/LMapProvider";
import { createPortal } from "react-dom";
import { assertNever } from "../utils/assert";

/**
 * - idle: Waiting for user actions.
 *   - if button is pressed, the status will be activating.
 * - activating: Polling current location now.
 *   - if location was found, the status will be following.
 * - following: Watching current location and put center on it always.
 *   - if dragStart was fired, the status will be activated.
 *   - if button was pressed, the status will be idle.
 * - activated: Watching current location but DO NOT put center on it.
 *   - if button was pressed, the status will be idle.
 * - error: Something went wrong.
 *   - if button was pressed, the status will be idle.
 */
type LocateControlStatus =
  | "idle"
  | "activating"
  | "following"
  | "activated"
  | "error";

type LocateControlOptions = {
  /**
   * handler for map.locate
   */
  onLocationFound?: L.LocationEventHandlerFn;
  /**
   * handler for map.locate
   */
  onLocationError?: L.ErrorEventHandlerFn;
  /**
   * handler
   */
  onChangeState?: (status: LocateControlStatus) => void;
} & L.ControlOptions;

class LocateControl extends L.Control {
  declare options: LocateControlOptions;
  declare _map: L.Map;
  declare _button: HTMLButtonElement;

  // for changeState
  // declare _isFollowing: boolean;
  // declare _isWatching: boolean;
  // declare _lastLocationEvent: L.LocationEvent | null;
  // declare _error: L.ErrorEvent | null;
  declare _locateControlStatus: LocateControlStatus;

  constructor(options?: LocateControlOptions) {
    super(options);
  }

  onAdd(map: L.Map) {
    console.debug("[LocateControl] onAdd");
    const container = L.DomUtil.create("button");
    container.onclick = this._onClickButton.bind(this);
    this._map = map;
    this._button = container;
    this._map.on("dragstart", this._onDragStart.bind(this));

    // ChangeState
    this._locateControlStatus = "idle";
    this._changeState();

    // return HTMLElement for leaflet
    return container;
  }

  onRemove() {
    this._deactivate();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onClickButton(_ev: MouseEvent) {
    switch (this._locateControlStatus) {
      case "idle":
      case "error":
        this._activate();
        break;
      case "following":
      case "activated":
        this._deactivate();
        break;
      case "activating":
        // nothing
        break;
      default:
        assertNever(this._locateControlStatus);
        break;
    }
  }

  /**
   * Start watching location.
   * When a user clicked location button at first time, fire this function.
   */
  _activate() {
    console.debug("[LLocateControl] activate().");
    // bind handlers
    this._map.on("locationfound", this._onLocationFound.bind(this));
    this._map.on("locationerror", this._onLocationError.bind(this));
    // fire locate
    this._map.locate({
      setView: true,
      watch: true,
    });
    // update state
    this._locateControlStatus = "activating";
    this._button.disabled = true;
    this._changeState();
  }

  /**
   *
   */
  _follow() {
    console.debug("[LLocateControl] follow().");
    // remove handlers
    // fire stopLocate
    this._map.stopLocate();
    // add handlers
    // fire locate
    this._map.locate({
      setView: false,
      watch: true,
    });
    // update state
    if (this._locateControlStatus === "following") {
      this._locateControlStatus = "activated";
    }
  }

  _unfollow() {
    console.debug("[LLocateControl] unfollow().");
    if (this._locateControlStatus === "following") {
      this._map.stopLocate();
      this._map.locate({
        setView: false,
        watch: true,
      });
      // change state
      this._locateControlStatus = "activated";
      this._changeState();
    }
  }

  /**
   * Stop watching location.
   * When a user clicked location button, fire this function.
   */
  _deactivate() {
    console.debug("[LLocateControl] deactivate().");
    // remove handlers
    this._map.off("locationfound");
    this._map.off("locationerror");
    // fire stopLocate
    this._map.stopLocate();
    // update state
    this._locateControlStatus = "idle";
    this._button.disabled = false;
    this._changeState();
  }

  /**
   * onLocationFound
   */
  _onLocationFound(ev: L.LocationEvent) {
    console.debug("[LLocateControl] onLocationFound");
    //  fire event
    this.options.onLocationFound?.(ev);
    // update state
    // this._error = null;
    // this._lastLocationEvent = ev;
    this._button.disabled = false;
    if (
      this._locateControlStatus === "activating" ||
      this._locateControlStatus === "error"
    ) {
      this._locateControlStatus = "following";
      this._changeState();
    }
  }

  /**
   * onLocationError
   */
  _onLocationError(ev: L.ErrorEvent) {
    this.options.onLocationError?.(ev);
    // update state
    // this._error = ev;
    this._button.disabled = false;
    this._locateControlStatus = "error";
    this._changeState();
  }

  /**
   * When a user start dragging, he may want to stop following center.
   */
  _onDragStart() {
    if (this._locateControlStatus === "following") {
      this._unfollow();
    }
  }

  /**
   *  fire changeState handler.
   */
  _changeState() {
    this.options.onChangeState?.(this._locateControlStatus);
  }
}

declare module "leaflet" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Control {
    class LocateControl extends L.Control {
      constructor(options?: LocateControlOptions);
      onAdd(map: Map): HTMLElement;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace control {
    function locateControl(
      options?: LocateControlOptions
    ): Control.LocateControl;
  }
}

L.control.locateControl = (options) => new LocateControl(options);

/**
 * LLocateControl component props
 */
type Props = {
  onLocationFound: L.LocationEventHandlerFn;
  onLocationError?: L.ErrorEventHandlerFn;
  icons: {
    [K in LocateControlStatus]: ReactNode;
  };
};

/**
 * LLocateControl component
 */
export function LLocateControl(props: Props) {
  const { icons, onLocationFound, onLocationError } = props;
  const map = useMap();

  // For re-rendering, useState instead of useRef.
  const [container, setContainer] = useState<HTMLElement | undefined>(
    undefined
  );
  const [locateControlState, setLocateControlState] =
    useState<LocateControlStatus>("idle");

  useEffect(() => {
    console.debug("[LLocateControl] useEffect");

    // FIXME: Reuse instance.
    // Always make a new instance whether first rendering or not.
    const locateControl = L.control.locateControl({
      onLocationFound,
      onLocationError,
      onChangeState: setLocateControlState,
    });
    locateControl.addTo(map);
    setContainer(locateControl.getContainer());

    return () => {
      console.debug("[LLocateControl] useEffect cleanup");
      locateControl.remove();
    };
  }, [map, onLocationFound, onLocationError]);

  if (container) {
    return createPortal(icons[locateControlState], container);
  }
  return null;
}
