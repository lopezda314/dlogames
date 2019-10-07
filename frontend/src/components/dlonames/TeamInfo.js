import React from "react"
import gql from "graphql-tag"
import styled from "styled-components"
import { Mutation } from "react-apollo"
import Button from "../styled/Button"

import { BLUE_TEAM_STRING } from "./DlonamesBoard"

const StyledTeamInfo = styled.div`
  border: 1px solid white;
  border-radius: 8px;
  font-size: 0.75rem;
  padding: 0.825rem 0.825rem;
  width: 45vw;
`

export const SWITCH_TEAM_MUTATION = gql`
  mutation SWITCH_TEAM_MUTATION(
    $id: String!
    $username: String!
    $teamName: String!
    $isCodemaster: Boolean!
  ) {
    switchTeam(
      id: $id
      username: $username
      teamName: $teamName
      isCodemaster: $isCodemaster
    ) {
      id
    }
  }
`

const TeamInfo = ({
  teamColor,
  codeMaster,
  teamMembers,
  id,
  canUserSwitch,
  username,
}) => (
  <StyledTeamInfo
    style={{
      color: teamColor === BLUE_TEAM_STRING ? "#50AEB5" : "#FF69B4",
    }}
  >
    <p>
      {teamColor} Team <br />
      <Mutation
        mutation={SWITCH_TEAM_MUTATION}
        variables={{
          id: id,
          username: username,
          teamName: teamColor === BLUE_TEAM_STRING ? "blueTeam" : "redTeam",
          isCodemaster: true,
        }}
      >
        {(switchTeam, { loading, error }) => {
          return (
            <span>
              Codemaster: {codeMaster} <br />
              <Button
                onClickHandler={async () => await switchTeam()}
                label="Switch Team"
                backgroundColor="grey"
              />
            </span>
          )
        }}
      </Mutation>
      <Mutation
        mutation={SWITCH_TEAM_MUTATION}
        variables={{
          id: id,
          username: username,
          teamName: teamColor === BLUE_TEAM_STRING ? "blueTeam" : "redTeam",
          isCodemaster: false,
        }}
      >
        {(switchTeam, { loading, error }) => {
          return (
            <span>
              Team: {teamMembers.join()}
              <Button
                onClickHandler={async () => await switchTeam()}
                label="Switch Team"
                backgroundColor="grey"
              />
            </span>
          )
        }}
      </Mutation>
    </p>
  </StyledTeamInfo>
)

export default TeamInfo
