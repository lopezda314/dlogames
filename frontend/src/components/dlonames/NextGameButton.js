import React from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"
import { getUser } from "../../utils/auth"

const NextGameButton = styled.button`
  background: yellowgreen;
  border: none;
  border-radius: 8px;
  display: block;
  font-size: 0.75rem;
  height: 3rem;
  margin: 2rem auto 0;
  text-decoration: none;
  transition: background 250ms ease-in-out, transform 150ms ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  :active {
    transform: scale(0.75);
    -webkit-transform: scale(0.75, 0.75);
  }
`
const CREATE_GAME_MUTATION = gql`
  mutation CREATE_GAME_MUTATION(
    $currentGameId: String!
    $currentUser: String!
  ) {
    createGame(prevDlonamesGameId: $currentGameId, creatorName: $currentUser) {
      id
    }
  }
`

const ChangeTurnButton = ({ id, shouldHide }) => {
  return (
    <Mutation
      mutation={CREATE_GAME_MUTATION}
      variables={{ currentGameId: id, currentUser: getUser() }}
    >
      {createGame => {
        let style = {}
        if (shouldHide) {
          style = { display: "none" }
        }
        return (
          <NextGameButton onClick={() => createGame()} style={style}>
            Next game
          </NextGameButton>
        )
      }}
    </Mutation>
  )
}

export default ChangeTurnButton
