import React from "react"
import styled from "styled-components"

import { BLUE_TEAM_STRING } from "./DlonamesBoard"

const StyledTeamInfo = styled.div`
  border: 1px solid white;
  border-radius: 8px;
  font-size: 0.75rem;
  padding: 0.825rem 0.825rem;
  width: 45vw;
`

const TeamInfo = ({ teamColor, codeMaster, teamMembers }) => (
  <StyledTeamInfo
    style={{
      color: teamColor === BLUE_TEAM_STRING ? "#50AEB5" : "#FF69B4",
    }}
  >
    <p>
      {teamColor} Team <br />
      Codemaster: {codeMaster} <br />
      Team: {teamMembers.join()}
    </p>
  </StyledTeamInfo>
)

export default TeamInfo
