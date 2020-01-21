import React from "react"
import styled from "styled-components"

const StyledButton = styled.button`
  background: none;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  text-decoration: none;
  transition: background 250ms ease-in-out, transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  :active {
    transform: scale(0.75);
    -webkit-transform: scale(0.75, 0.75);
  }
`

const TeamButton = ({
  label,
  onClickHandler,
  backgroundColor,
  isCodemaster = false,
}) => {
  const style = { background: backgroundColor }
  // if (isCodemaster) {
  //   style
  // }

  return (
    <StyledButton
      onClick={onClickHandler}
      value={label}
      style={{
        background: backgroundColor,
      }}
    >
      {label}
    </StyledButton>
  )
}

export default TeamButton
