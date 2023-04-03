import React, { useContext, useState } from "react";
import { Button as ButtonBase } from "components/atoms";
import styled from "styled-components";
import { DataContext } from "components/organisms";
import { Scenario, scenarios, setupScenario } from "scenarios";

const Wrapper = styled.nav`
	width: 260px;
	height: 100%;
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

const Description = styled.div`
	position: fixed;
	top: 10px;
	right: 10px;
	box-shadow: 0 0 0 2px rgb(0 0 0/10%);
	border-radius: 4px;
	z-index: 100000;
	background-color: #ffffff;
	color: black;
	width: 35%;
	padding: 8px;
	font-size: 14px;
`;

/**
 * Primary left nav of the app
 */
export const Nav: React.FC = () => {
	const { map, setResults } = useContext(DataContext);
	const [scenario, setScenario] = useState<Scenario>();

	return (
		<Wrapper>
			<h2 style={{ fontWeight: "normal", paddingLeft: "20px" }}>Scenarios</h2>
			{scenarios.map((scenario, i) => (
				<Button
					key={scenario.title}
					onClick={() => {
						/**
						 * Clean up all custom behaviors before triggering this new scenario
						 */
						scenarios.forEach(sc => {
							if (sc.cleanupCustomBehavior) {
								sc.cleanupCustomBehavior(map, setResults);
							}
						});

						setupScenario(map, scenario, setResults);
						setScenario(scenario);
					}}
					style={{ borderTop: i === 0 ? "1px solid #393d48" : undefined }}
				>
					<H3>{scenario.title}</H3>
					{scenario.subtitle}
				</Button>
			))}

			{scenario && (
				<Description
					dangerouslySetInnerHTML={{ __html: scenario?.description }}
				/>
			)}
		</Wrapper>
	);
};
