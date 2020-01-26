import React, { Component } from "react"
import { Mutation, Query } from "react-apollo"
import { navigate } from "@reach/router"
import { getProfile } from "../../utils/auth"
import gql from "graphql-tag"
import GuessInfo from "./GuessInfo"
import TeamInfo from "./TeamInfo"
import Button, {
  blueTranslucent,
  redTranslucent,
  blackTranslucent,
  grayTranslucent,
  blue,
  red,
  black,
  gray,
} from "./WordButton"
import { gameIdQuery } from "../../utils/history-helper"

export const BLUE_TEAM_STRING = "Blue"
export const RED_TEAM_STRING = "Red"
const ROWS_PER_GAME = 5
const WORDS_PER_ROW = 5

export const CREATE_GAME_MUTATION = gql`
  mutation CREATE_GAME_MUTATION($creatorName: String!) {
    createGame(creatorName: $creatorName) {
      id
    }
  }
`

export const JOIN_GAME_MUTATION = gql`
  mutation JOIN_GAME_MUTATION($username: String!, $id: String!) {
    joinGame(username: $username, id: $id) {
      id
    }
  }
`

export const GET_GAME_QUERY = gql`
  query GET_GAME_QUERY($id: ID!, $username: String) {
    game(id: $id, username: $username) {
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
      gameIsFinished
      currentTeam
      winningTeam
    }
  }
`

const isCurrentUserTurn = (username, blueTeam, redTeam, currentTeam) => {
  if (blueTeam.includes(username) && currentTeam === "blueTeam") return true
  if (redTeam.includes(username) && currentTeam === "redTeam") return true
  return false
}

const isUserOnATeam = (username, team1, team2) => {
  return new Set(team1).has(username) || new Set(team2).has(username)
}

const isCurrentUserCodemaster = (username, blueCodemaster, redCodemaster) => {
  return username === blueCodemaster || username === redCodemaster
}

class DlonamesBoard extends Component {
  render() {
    const currentUser = getProfile()
    let gameId = this.props.gameId

    if (!gameId) {
      return (
        <Mutation
          mutation={CREATE_GAME_MUTATION}
          variables={{ creatorName: currentUser.nickname }}
        >
          {(createGame, { loading, error }) => {
            if (loading) return <p>Creating game...</p>
            if (error) return <p>Error: {error.message}</p>
            return (
              <Button
                onClickHandler={async () => {
                  const createGameResponse = await createGame()
                  gameId = createGameResponse.data.createGame.id
                  navigate("/dlonames/game?" + gameIdQuery + "=" + gameId)
                }}
                label="Create Game"
                backgroundColor="grey"
              />
            )
          }}
        </Mutation>
      )
    }

    return (
      // TODO: Change the poll interval to be smaller closer to launch.
      <Query
        query={GET_GAME_QUERY}
        variables={{ id: gameId, username: currentUser.nickname }}
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
            gameIsFinished,
            winningTeam,
            currentTeam,
          } = data.game

          const username = currentUser.nickname.toLowerCase()

          let guessInfoOrTeamWinInfo
          if (gameIsFinished) {
            guessInfoOrTeamWinInfo = (
              <p style={{ textAlign: "center" }}>
                {"🎉"}
                {winningTeam === "redTeam" ? "Red Team" : "Blue Team"} wins!
                {"🎉"}
              </p>
            )
          } else {
            guessInfoOrTeamWinInfo = (
              <GuessInfo
                id={gameId}
                clue={clue}
                numGuesses={numGuesses}
                enabled={
                  isCurrentUserCodemaster(
                    username,
                    blueCodemaster,
                    redCodemaster
                  ) &&
                  isCurrentUserTurn(username, blueTeam, redTeam, currentTeam) &&
                  !clue
                }
              />
            )
          }

          if (!isUserOnATeam(username, redTeam, blueTeam)) {
            return (
              <Mutation
                mutation={JOIN_GAME_MUTATION}
                variables={{ username: username, id: gameId }}
                refetchQueries={[
                  { query: GET_GAME_QUERY, variables: { id: gameId } },
                ]}
              >
                {(joinGame, { loading, error }) => {
                  if (loading) return <p>Joining game...</p>
                  if (error) return <p>Error: {error.message}</p>
                  return (
                    <Button
                      onClickHandler={async () => {
                        await joinGame()
                      }}
                      label="Join Game"
                      backgroundColor="grey"
                    />
                  )
                }}
              </Mutation>
            )
          }

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
                username={username}
                isCurrentUserCodemaster={isCurrentUserCodemaster(
                  username,
                  blueCodemaster,
                  redCodemaster
                )}
                gameIsFinished={gameIsFinished}
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
                  id={gameId}
                  username={username}
                />
                <TeamInfo
                  teamColor={RED_TEAM_STRING}
                  codeMaster={redCodemaster}
                  teamMembers={redTeam}
                  id={gameId}
                  username={username}
                />
              </div>
              {guessInfoOrTeamWinInfo}
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
  mutation GUESS_WORD_MUTATION(
    $id: String!
    $wordGuessed: String!
    $username: String!
  ) {
    guessWord(id: $id, word: $wordGuessed, username: $username) {
      numGuesses
      wordsGuessed
    }
  }
`

const getColorForWord = (
  word,
  blueWords,
  redWords,
  deathWord,
  wordsGuessed,
  isCurrentUserCodemaster,
  gameIsFinished
) => {
  let wordHasBeenGuessed = false
  if (new Set(wordsGuessed).has(word)) {
    wordHasBeenGuessed = true
  }
  if (!gameIsFinished && !isCurrentUserCodemaster) {
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

const Row = ({
  words,
  blueWords,
  redWords,
  deathWord,
  id,
  wordsGuessed,
  username,
  isCurrentUserCodemaster,
  gameIsFinished,
}) => (
  <Mutation
    mutation={GUESS_WORD_MUTATION}
    variables={{
      id: id,
      username: username,
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
              wordsGuessed,
              isCurrentUserCodemaster,
              gameIsFinished
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
