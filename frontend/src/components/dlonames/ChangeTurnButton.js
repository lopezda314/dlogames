import React from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"
import { getProfile } from "../../utils/auth"

const StyledButton = styled.button`
  background: none;
  border: none;
  border-radius: 50%;
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
const CHANGE_TURN_MUTATION = gql`
  mutation CHANGE_TURN_MUTATION($id: String!, $username: String!) {
    changeTurn(id: $id, username: $username) {
      id
    }
  }
`

const ChangeTurnButton = ({id}) => {
  return (
    <Mutation
      mutation={CHANGE_TURN_MUTATION}
      variables={{ id: id, username: getProfile().nickname }}
    >
      {changeTurn => {
        return (
          <StyledButton onClick={() => changeTurn()}>
            Done Guessing
          </StyledButton>
        )
      }}
    </Mutation>
  )
}

export default ChangeTurnButton
