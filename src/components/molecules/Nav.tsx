import React, { useContext, useEffect, useState } from "react";
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
	color: #ffffff;
	transition: all 200ms;

	&.active {
		color: #b8fff8;
		transition: all 200ms;
	}
`;

const H3 = styled.h3`
	margin: 0;
	color: #ffffff;
	transition: all 200ms;

	&.active {
		color: #b8fff8;
		transition: all 200ms;
	}
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
	const [currentScenario, setCurrentScenario] = useState<Scenario>();

	useEffect(() => {
		if (map) {
			setupScenario(map, scenarios[0], setResults);
			setCurrentScenario(scenarios[0]);
		}
	}, [map]);

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
						setCurrentScenario(scenario);
					}}
					style={{ borderTop: i === 0 ? "1px solid #393d48" : undefined }}
					className={currentScenario?.title === scenario.title ? "active" : ""}
				>
					<H3
						className={
							currentScenario?.title === scenario.title ? "active" : ""
						}
					>
						{scenario.title}
					</H3>
					{scenario.subtitle}
				</Button>
			))}

			{currentScenario && (
				<Description
					dangerouslySetInnerHTML={{ __html: currentScenario?.description }}
				/>
			)}
		</Wrapper>
	);
};
