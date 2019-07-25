import React from "react"
import styled from "styled-components"

export const black = "#393939"
export const blue = "blue"
export const gray = "whitesmoke"
export const red = "red"

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

const Button = ({ label, onClickHandler, backgroundColor }) => (
  <StyledButton
    onClick={onClickHandler}
    value={label}
    style={{
      background: backgroundColor,
      color:
        backgroundColor === red || backgroundColor === gray ? "black" : "white",
    }}
  >
    {label}
  </StyledButton>
)

export default Button
