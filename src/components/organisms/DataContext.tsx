import React, { ReactNode, useState } from "react";
import { Map as MapboxMap } from "mapbox-gl";

/**
 * Results object
 */
export interface Results {
	/**
	 * Elevation profile data, as an array of [x,y] points
	 */
	elevationProfile: number[][];
}

export interface DataContextProps {
	/**
	 * The map object
	 */
	map: MapboxMap;
	/**
	 * State setter to set the map context
	 */
	setMap: React.Dispatch<React.SetStateAction<MapboxMap>>;
	/**
	 * Results object
	 */
	results: Results;
	/**
	 * State setter to set the map context
	 */
	setResults: React.Dispatch<React.SetStateAction<Results>>;
}

/**
 * The map context
 */
export const DataContext = React.createContext(
	{} as unknown as DataContextProps
);

interface Props {
	/**
	 * Children to render that can consume the context
	 */
	children: ReactNode | ReactNode[];
}

/**
 * A context provider that makes the central mapbox map reference available to any of its children,
 * as well as stores the resulting elevation profile data
 */
export const MapContextProvider: React.FC<Props> = ({ children }: Props) => {
	/**
	 * Initialize context with blank map, but will be replaced when the primary mapbox map loads
	 */
	const [map, setMap] = useState<MapboxMap>(undefined as unknown as MapboxMap);
	const [results, setResults] = useState<Results>({ elevationProfile: [] });

	return (
		<DataContext.Provider value={{ map, setMap, results, setResults }}>
			{children}
		</DataContext.Provider>
	);
};
