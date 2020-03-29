import React, { Component } from "react"
import gql from "graphql-tag"
import styled from "styled-components"
import { Mutation } from "react-apollo"
import { getUser } from "../../utils/auth"

const GuessForm = styled.form`
  padding: 0 0.75rem;
  div[role="group"] {
    border: 0;
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 0.5rem;
  }
  input {
    width: 30vw;
  }
  button[type="submit"] {
    background: gray;
    border: 0;
    border-radius: 8px;
    color: white;
    display: block;
    font-size: 1.5rem;
    font-weight: 600;
    margin: 10px auto 0;
    padding: 1rem 3rem;
  }
`

const SUBMIT_CLUE_MUTATION = gql`
  mutation SUBMIT_CLUE_MUTATION(
    $id: String!
    $clue: String!
    $numGuesses: Int!
    $username: String!
  ) {
    submitClue(
      id: $id
      clue: $clue
      numGuesses: $numGuesses
      username: $username
    ) {
      clue
      numGuesses
    }
  }
`

class GuessInfo extends Component {
  state = {
    clue: "",
    numGuesses: "",
  }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === "number" ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  render() {
    const { enabled } = this.props
    const submitButtonIfEnabled = enabled ? (
      <button type="submit">Submit Clue</button>
    ) : (
      <React.Fragment></React.Fragment>
    )

    return (
      <Mutation
        mutation={SUBMIT_CLUE_MUTATION}
        variables={{
          id: this.props.id,
          clue: this.state.clue,
          numGuesses: this.state.numGuesses,
          username: getUser(),
        }}
      >
        {(submitClue, { error }) => {
          if (error) return <p>Error: {error.message}</p>

          return (
            <GuessForm
              onSubmit={async e => {
                e.preventDefault()

                await submitClue()
              }}
            >
              <div role="group">
                <input
                  type="text"
                  name="clue"
                  id="clue"
                  placeholder={enabled ? "clue" : "Waiting"}
                  value={
                    enabled ? this.state.clue || "" : this.props.clue || ""
                  }
                  required
                  onChange={this.handleChange}
                  disabled={!enabled}
                />
                <span>for</span>
                <input
                  type="number"
                  name="numGuesses"
                  id="numGuesses"
                  placeholder={
                    enabled
                      ? "# guesses"
                      : this.props.clue
                      ? "Bonus"
                      : "Waiting"
                  }
                  value={
                    enabled
                      ? this.state.numGuesses || ""
                      : this.props.numGuesses || ""
                  }
                  required
                  onChange={this.handleChange}
                  disabled={!enabled}
                />
              </div>
              {submitButtonIfEnabled}
            </GuessForm>
          )
        }}
      </Mutation>
    )
  }
}

export default GuessInfo
