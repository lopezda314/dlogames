import React from "react"
import styled from "styled-components"

export const black = "#393939"
export const blue = "blue"
export const gray = "whitesmoke"
export const red = "red"

const StyledButton = styled.button`
  border-radius: 8px;
  font-size: 1rem;
  height: 48px;
  width: 19%;
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
