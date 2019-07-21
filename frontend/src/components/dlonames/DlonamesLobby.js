import React, { Component } from "react"
import gql from "graphql-tag"
import { navigate } from "@reach/router"

import Form from "../styled/Form"
import { Mutation } from "react-apollo"

export const CREATE_GAME_MUTATION = gql`
  mutation CREATE_GAME_MUTATION($creatorName: String!) {
    createGame(creatorName: $creatorName) {
      id
    }
  }
`

export const gameIdQuery = "gid"

class DlonamesLobby extends Component {
  state = {
    username: "",
    gameId: "",
  }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === "number" ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_GAME_MUTATION}
        variables={{ creatorName: this.state.username }}
      >
        {(createGame, { loading, error }) => {
          if (loading) return <p>Creating game...</p>
          if (error) return <p>Error: {error.message}</p>

          return (
            <Form
              onSubmit={async e => {
                e.preventDefault()

                const res = await createGame()

                // Navigate to game page
                navigate(
                  "/dlonames/game?" +
                    gameIdQuery +
                    "=" +
                    res.data.createGame.id,
                  {
                    state: this.state,
                  }
                )
              }}
            >
              <fieldset>
                <label>
                  Name
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="username"
                    required
                    onChange={this.handleChange}
                  />
                </label>
                <label>
                  Game
                  <br />
                  <input
                    type="text"
                    name="gameId"
                    id="gameId"
                    placeholder="game id"
                    onChange={this.handleChange}
                  />
                </label>
              </fieldset>
              <button type="submit">
                {this.state.gameId ? "Join" : "Start"}
              </button>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default DlonamesLobby
