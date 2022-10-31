import React from "react";
import { Footer, Map, MapContextProvider, Nav } from "components";
import styled from "styled-components";

const Wrapper = styled.div`
	display: flex;
	height: 100%;
`;

const Column = styled.div`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	flex: 1;
`;

export const App: React.FC = () => {
	return (
		<Wrapper>
			<MapContextProvider>
				<Nav />
				<Column>
					<Map />
					<Footer />
				</Column>
			</MapContextProvider>
		</Wrapper>
	);
};
