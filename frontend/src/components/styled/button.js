import React from "react"
import styled from "styled-components"

export const blueTranslucent = "rgba(0, 0, 255, 0.5)"
export const redTranslucent = "rgba(255, 0, 0, 0.5)"
export const blackTranslucent = "#393939"
export const grayTranslucent = "#828282"
export const blue = "rgba(0, 0, 255, 1)"
export const red = "rgba(255, 0, 0, 1)"
export const black = "rgba(0, 0, 0, 1)"
export const gray = "#D3D3D3"

const StyledButton = styled.button`
  background: none;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  height: 48px;
  text-decoration: none;
  transition: background 250ms ease-in-out, transform 150ms ease;
  width: 19%;
  -webkit-appearance: none;
  -moz-appearance: none;
  :active {
    transform: scale(0.75);
    -webkit-transform: scale(0.75, 0.75);
  }
`

const isLowContrastAgainstWhite = color =>
  color === gray ||
  color === grayTranslucent ||
  color === red ||
  color === redTranslucent

const Button = ({ label, onClickHandler, backgroundColor }) => (
  <StyledButton
    onClick={onClickHandler}
    value={label}
    style={{
      background: backgroundColor,
      color: isLowContrastAgainstWhite(backgroundColor) ? "black" : "white",
    }}
  >
    {label}
  </StyledButton>
)

export default Button
