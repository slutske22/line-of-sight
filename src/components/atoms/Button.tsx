import React, { HTMLAttributes } from "react";
import styled, { keyframes } from "styled-components";
import { shift } from "utils";
import { LoadingSpinner } from "./LoadingSpinner";

const ANIMATION_MS = 700;
const CIRCLE_SIZE = 50;

const ripple = keyframes`
  0% {
    opacity: 0.1;
    transform: scale(0.5);
  }

  50% {
    transform: scale(8);
  }

  80% {
    opacity: 0;
  }
`;

const ButtonWrapper = styled.button<StyleProps>`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px;
	cursor: ${props => (props.disabled ? "auto" : "pointer")};
	overflow: hidden;
	letter-spacing: 1px;
	transition: all 0.2s cubic-bezier(0.06, 0.67, 0.37, 0.99);
	color: white;
	background-color: ${props =>
		props.outline === "filled"
			? props.disabled
				? "#A1A5B6"
				: "#393D48"
			: "#393D48"};
	border: none;
	box-shadow: 0px 0px 8px rgba(0, 0, 0, 0);
	transition: all 300ms;

	&:hover {
		box-shadow: ${props =>
			props.outline === "bare"
				? "0px 0px 8px rgba(0, 0, 0, 0)"
				: "0px 0px 8px rgba(0, 0, 0, 0.2)"};
		transition: all 300ms;
	}

	* {
		pointer-events: none;
	}
`;

const ButtonRipple = styled.div<{ x: number; y: number }>`
	position: absolute;
	top: ${props => props.y}px;
	left: ${props => props.x}px;
	height: ${CIRCLE_SIZE}px;
	width: ${CIRCLE_SIZE}px;
	background: currentColor;
	opacity: 0.3;
	border-radius: 50%;
	animation-name: ${ripple};
	animation-duration: ${ANIMATION_MS * 2}ms;
	animation-iteration-count: 1;
	animation-timing-function: ease;
	pointer-events: none;
`;

interface Ripple {
	id: number;
	x: number;
	y: number;
}

interface StyleProps {
	/**
	 * Variant of the button, to use standard styles.  Filled fills the button with blue,
	 * bare has no background or border with blue text
	 */
	outline?: "filled" | "bare";
	/**
	 * Coloration variant
	 */
	variant?: "error";
	/**
	 * Convenience prop to show loading state - will render loading
	 * spinner instead of button content
	 */
	loading?: boolean;
	/**
	 * Whether or not button is disabled
	 */
	disabled?: boolean;
	/**
	 * Whether or not the button gets a flex-grow of 1, helpful when buttons are aligned
	 * in a row
	 */
	flexGrow?: boolean;
	/**
	 * Whether or not the button has extra padding / height
	 */
	plump?: boolean;
	/**
	 * Whether or not to use the ripple effect, defaults to true
	 */
	ripple?: boolean;
	/**
	 * Instead of using user click location as origin of ripple, use center of button box
	 */
	centerRipple?: boolean;
	/**
	 * Custom styles applied to the button
	 */
	style?: React.CSSProperties;
}

export type ButtonProps = StyleProps & HTMLAttributes<HTMLButtonElement>;

/**
 * Reusable, Persium-Dashboard branded button.  Defaults to use ripple effect, can
 * set `ripple={false}` in props to remove this behavior.  Have various variants
 * and outline options, all of which can be overridden with standard `style` props,
 * or by re-styling with styled components
 *
 * Written as a good ol' class component to keep ripples state working properly
 */
export class Button extends React.Component<ButtonProps> {
	state = {
		ripples: [],
	};

	id = 0;

	/**
	 * Callback to create a ripple effects when clicking the button
	 */
	handleRipple = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const box = (e.target as HTMLButtonElement).getBoundingClientRect();

		const { centerRipple } = this.props;

		const id = ++this.id;

		this.setState({
			ripples: [
				...this.state.ripples,
				{
					id,
					x: centerRipple
						? box.width / 2 - CIRCLE_SIZE / 2
						: e.clientX - box.left - CIRCLE_SIZE / 2,
					y: centerRipple
						? box.height / 2 - CIRCLE_SIZE / 2
						: e.clientY - box.top - CIRCLE_SIZE / 2,
				},
			],
		});

		setTimeout(() => {
			this.setState({
				ripples: shift(this.state.ripples),
			});
		}, ANIMATION_MS);
	};

	handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		const { ripple = true, onClick } = this.props;

		if (onClick) {
			onClick(e);
		}

		if (ripple) {
			this.handleRipple(e);
		}
	};

	render() {
		const { ripple, centerRipple, children, onClick, loading, ...rest } =
			this.props;

		return (
			<ButtonWrapper onClick={this.handleClick} {...rest}>
				{loading ? <LoadingSpinner style={{ height: "100%" }} /> : children}
				{this.state.ripples.map((ripple: Ripple) => (
					<ButtonRipple key={ripple.id} x={ripple.x} y={ripple.y} />
				))}
			</ButtonWrapper>
		);
	}
}
