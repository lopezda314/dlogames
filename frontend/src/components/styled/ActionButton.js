import React from "react"
import styled from "styled-components"

const StyledButton = styled.button`
  background: none;
  background-color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.25rem;
  height: 96px;
  text-decoration: none;
  transition: background 250ms ease-in-out, transform 150ms ease;
  width: 96px;
  -webkit-appearance: none;
  -moz-appearance: none;
  :active {
    transform: scale(0.75);
    -webkit-transform: scale(0.75, 0.75);
  }
`

const ActionButton = ({ label, onClickHandler }) => (
  <StyledButton onClick={onClickHandler} value={label}>
    {label}
  </StyledButton>
)

export default ActionButton
