import React, { Component } from "react"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import GuessInfo from "./GuessInfo"
import TeamInfo from "./TeamInfo"
import { gameIdQuery } from "./DlonamesLobby"
import Button, {
  blueTranslucent,
  redTranslucent,
  blackTranslucent,
  grayTranslucent,
  blue,
  red,
  black,
  gray,
} from "../styled/button"

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
      wordsGuessed
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
            wordsGuessed,
          } = data.game

          const rows = []
          for (let i = 0; i < ROWS_PER_GAME; i++) {
            const firstIndexOfRow = i * ROWS_PER_GAME
            const rowWords = words.slice(
              firstIndexOfRow,
              firstIndexOfRow + WORDS_PER_ROW
            )
            rows.push(
              <Row
                key={rowWords.join("")}
                words={rowWords}
                blueWords={blueWords}
                redWords={redWords}
                deathWord={deathWord}
                wordsGuessed={wordsGuessed}
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
                  margin: "0 -.75rem",
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
  mutation GUESS_WORD_MUTATION($id: String!, $wordGuessed: String!) {
    guessWord(id: $id, word: $wordGuessed) {
      numGuesses
      wordsGuessed
    }
  }
`

const isCurrentUserCodemaster = () =>
  // TODO(david): Dynamically determine this based on user and response from server
  true

const getColorForWord = (
  word,
  blueWords,
  redWords,
  deathWord,
  wordsGuessed
) => {
  let wordHasBeenGuessed = false
  if (new Set(wordsGuessed).has(word)) {
    wordHasBeenGuessed = true
  }
  if (!isCurrentUserCodemaster()) {
    if (!wordHasBeenGuessed) return grayTranslucent
  }
  if (new Set(blueWords).has(word)) {
    return wordHasBeenGuessed ? blue : blueTranslucent
  }
  if (new Set(redWords).has(word)) {
    return wordHasBeenGuessed ? red : redTranslucent
  }
  if (word === deathWord) {
    return wordHasBeenGuessed ? black : blackTranslucent
  }
  return wordHasBeenGuessed ? gray : grayTranslucent
}

const Row = ({ words, blueWords, redWords, deathWord, id, wordsGuessed }) => (
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
                },
              })
            }
            backgroundColor={getColorForWord(
              words[i],
              blueWords,
              redWords,
              deathWord,
              wordsGuessed
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
