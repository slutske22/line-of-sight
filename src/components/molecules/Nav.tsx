import React from "react";
import { Button as ButtonBase } from "components/atoms";
import styled from "styled-components";

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
	return (
		<Wrapper>
			<h2 style={{ fontWeight: "normal", paddingLeft: "20px" }}>Scenarios</h2>
			<Button style={{ borderTop: "1px solid darkgrey" }}>
				<H3>Radio Tower</H3>
				Air to ground
			</Button>
			<Button>
				<H3>Lighthouse</H3>
				Water to ground
			</Button>
			<Button>
				<H3>Light the Beacons</H3>
				Ground to Ground
			</Button>
			<Button>
				<H3>Submarine</H3>
				Bathymetric
			</Button>
		</Wrapper>
	);
};
