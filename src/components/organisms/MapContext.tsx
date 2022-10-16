import React, { ReactNode, useContext, useState } from "react";
import { Map as MapboxMap } from "mapbox-gl";

export interface MapContextProps {
	/**
	 * The map object
	 */
	map: MapboxMap;
	/**
	 * State setter to set the map context
	 */
	setMap: React.Dispatch<React.SetStateAction<MapboxMap>>;
}

/**
 * The map context
 */
export const MapContext = React.createContext({} as unknown as MapContextProps);

interface Props {
	/**
	 * Children to render that can consume the context
	 */
	children: ReactNode | ReactNode[];
}

/**
 * A context provider that makes the central mapbox map reference available to any of its children
 */
export const MapContextProvider: React.FC<Props> = ({ children }: Props) => {
	/**
	 * Initialize context with blank map, but will be replaced when the primary mapbox map loads
	 */
	const [map, setMap] = useState<MapboxMap>(undefined as unknown as MapboxMap);

	return (
		<MapContext.Provider value={{ map, setMap }}>
			{children}
		</MapContext.Provider>
	);
};

/**
 * Utility hook for quickly getting the underlying mapbox map instance
 */
export const useMap = () => {
	const { map } = useContext(MapContext);
	return map;
};
