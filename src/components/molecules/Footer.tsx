import React, { useContext } from "react";
import styled from "styled-components";
import HighchartsReact from "highcharts-react-official";
import Highcharts, { Options } from "highcharts";
import { DataContext } from "components/organisms";

const Wrapper = styled.footer`
	min-height: 240px;
`;

/**
 * Footer component which contains line of sight results and charts
 */
export const Footer: React.FC = () => {
	const { results } = useContext(DataContext);

	const graphOptions: Options = {
		chart: {
			type: "spline",
			backgroundColor: "none",
			height: 230,
			zooming: {
				type: "x",
			},
		},
		credits: {
			enabled: false,
		},
		plotOptions: {
			spline: {
				lineWidth: 2.5,
				showInLegend: false,
				color: "#00A7E1",
				marker: {
					enabled: false,
				},
			},
		},
		title: {
			text: "",
		},
		yAxis: {
			title: {
				text: "Elevation",
			},
			gridLineWidth: 0,
			softMax: 1,
			labels: {
				enabled: true,
			},
		},
		series: [
			{
				type: "spline",
				data: results.elevationProfile,
			},
			{
				type: "spline",
				data: results.losLine,
				color: results.los ? "green" : "red",
			},
		],
	};

	return (
		<Wrapper>
			<HighchartsReact highcharts={Highcharts} options={graphOptions} />
		</Wrapper>
	);
};
