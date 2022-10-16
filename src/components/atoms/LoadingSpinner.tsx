import React, { ImgHTMLAttributes } from "react";
import styled from "styled-components";
// @ts-expect-error because
import LoadingSpinnerImg from "assets/images/loading-spinner.svg";

export const LoadingSpinnerWrapper = styled.img`
	width: 80px;
`;

/**
 * Loading Spinner component commonly used for loading states
 */
export const LoadingSpinner = (props: ImgHTMLAttributes<HTMLImageElement>) => {
	return <LoadingSpinnerWrapper src={LoadingSpinnerImg} {...props} />;
};
