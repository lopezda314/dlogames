import React from "react"
import styled from "styled-components"

const StyledButton = styled.button`
  background: none;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  max-width: 80%;
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
  isCurrentTeam,
}) => {
  const style = { background: backgroundColor }
  if (!isCodemaster) {
    style.whiteSpace = "initial"
    style.overflow = "scroll"
    style.height = "2rem"
  }
  return (
    <StyledButton onClick={onClickHandler} value={label} style={style}>
      <span style={{ fontSize: "1rem" }}>{isCodemaster && "👑"}</span>
      {label}
    </StyledButton>
  )
}

export default TeamButton
