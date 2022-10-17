import React from "react";
import { Button as ButtonBase } from "components/atoms";
import styled from "styled-components";
import { useMap } from "components/organisms";
import { scenarios, setupScenario } from "scenarios";

const Wrapper = styled.nav`
	width: 300px;
	height: 100%;
	border: 1px solid black;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	background-color: #393d48;
	color: white;
`;

const Button = styled(ButtonBase)`
	border-bottom: 1px solid darkgrey;
	flex-direction: column;
	align-items: flex-start;
`;

const H3 = styled.h3`
	margin: 0;
`;

/**
 * Primary left nav of the app
 */
export const Nav = () => {
	const map = useMap();

	return (
		<Wrapper>
			<h2 style={{ fontWeight: "normal", paddingLeft: "20px" }}>Scenarios</h2>
			{scenarios.map((scenario, i) => (
				<Button
					key={scenario.title}
					onClick={() => {
						setupScenario(map, scenario);
					}}
					style={{ borderTop: i === 0 ? "1px solid #393d48" : undefined }}
				>
					<H3>{scenario.title}</H3>
					{scenario.subtitle}
				</Button>
			))}
		</Wrapper>
	);
};
