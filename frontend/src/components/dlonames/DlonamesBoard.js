import React, { Component } from "react"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import Button, { blue, red, black, gray } from "../styled/button"
import GuessInfo from "./GuessInfo"
import TeamInfo from "./TeamInfo"
import { gameIdQuery } from "./DlonamesLobby"

export const BLUE_TEAM_STRING = "Blue"
export const RED_TEAM_STRING = "Red"
const ROWS_PER_GAME = 5
const WORDS_PER_ROW = 5

export const GET_GAME_QUERY = gql`
  query GET_GAME_QUERY($id: ID!) {
    game(id: $id) {
      redCodemaster
      blueCodemaster
      redTeam
      blueTeam
      words
      blueWords
      redWords
      deathWord
      clue
      numGuesses
    }
  }
`

class DlonamesBoard extends Component {
  render() {
    const gameId = new URLSearchParams(this.props.location.search).get(
      gameIdQuery
    )

    return (
      // TODO: Change the poll interval to be smaller closer to launch.
      <Query
        query={GET_GAME_QUERY}
        variables={{ id: gameId }}
        pollInterval={5000}
      >
        {({ data, loading, error }) => {
          if (loading) return <p>Loading game...</p>
          if (error) return <p>Error: ${error.message}</p>

          const {
            words,
            redCodemaster,
            blueCodemaster,
            redTeam,
            blueTeam,
            blueWords,
            redWords,
            deathWord,
            clue,
            numGuesses,
          } = data.game

          const rows = []
          for (
            let i = 0;
            i < ROWS_PER_GAME * WORDS_PER_ROW;
            i += WORDS_PER_ROW
          ) {
            const rowWords = words.slice(i, i + WORDS_PER_ROW)
            rows.push(
              <Row
                key={rowWords.join("")}
                words={rowWords}
                row={i}
                blueWords={blueWords}
                redWords={redWords}
                deathWord={deathWord}
                id={gameId}
              />
            )
          }
          return (
            <React.Fragment>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  padding: ".5rem",
                }}
              >
                <TeamInfo
                  teamColor={BLUE_TEAM_STRING}
                  codeMaster={blueCodemaster}
                  teamMembers={blueTeam}
                />
                <TeamInfo
                  teamColor={RED_TEAM_STRING}
                  codeMaster={redCodemaster}
                  teamMembers={redTeam}
                />
              </div>
              <GuessInfo id={gameId} clue={clue} numGuesses={numGuesses} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
              >
                {/* Refactor this to use context providers or hooks instead of big lists of props. */}
                {rows}
              </div>
            </React.Fragment>
          )
        }}
      </Query>
    )
  }
}

export const GUESS_WORD_MUTATION = gql`
  mutation GUESS_WORD_MUTATION(
    $id: String!
    $wordGuessed: String!
    $indexOfWordGuessed: Int!
  ) {
    guessWord(id: $id, word: $wordGuessed, index: $indexOfWordGuessed) {
      numGuesses
      wordsGuessed
    }
  }
`

const getColorForWord = (row, column, blueWords, redWords, deathWord) => {
  const indexForWord = row * 5 + column
  if (new Set(blueWords).has(indexForWord)) {
    return blue
  }
  if (new Set(redWords).has(indexForWord)) {
    return red
  }
  if (indexForWord === deathWord) {
    return black
  }
  return gray
}

const Row = ({ words, row, blueWords, redWords, deathWord, id }) => (
  <Mutation
    mutation={GUESS_WORD_MUTATION}
    variables={{
      id: id,
    }}
  >
    {(guessWord, { error }) => {
      if (error) return <p>error: {error.message}</p>

      const buttons = []
      for (let i = 0; i < WORDS_PER_ROW; i++) {
        buttons.push(
          <Button
            key={words[i]}
            label={words[i]}
            onClickHandler={e =>
              guessWord({
                variables: {
                  wordGuessed: e.target.value,
                  indexOfWordGuessed: i,
                },
              })
            }
            backgroundColor={getColorForWord(
              row,
              i,
              blueWords,
              redWords,
              deathWord
            )}
          />
        )
      }
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            paddingTop: "2vh",
          }}
        >
          {buttons}
        </div>
      )
    }}
  </Mutation>
)

export default DlonamesBoard
