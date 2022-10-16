import React from "react";
import { Map, MapContextProvider, Nav } from "components";
import styled from "styled-components";

const Wrapper = styled.div`
	display: flex;
	height: 100%;
`;

export const App: React.FC = () => {
	return (
		<Wrapper>
			<MapContextProvider>
				<Nav />
				<Map />
			</MapContextProvider>
		</Wrapper>
	);
};
