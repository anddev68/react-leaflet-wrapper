import React, { ReactNode, useContext } from "react";

const context = React.createContext<L.Map | undefined>(undefined);

type Props = {
  map: L.Map;
  children: ReactNode;
};

export const LMapProvider = (props: Props) => {
  return (
    <context.Provider value={props.map}>{props.children}</context.Provider>
  );
};

export const useMap = () => {
  const map = useContext(context);

  if (!map) {
    throw new Error("Do not use useMap before initialized.");
  }

  return map;
};
