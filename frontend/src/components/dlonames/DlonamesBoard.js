import React, { Component } from "react"
import { Mutation, Query } from "react-apollo"
import { navigate } from "@reach/router"
import { getUser } from "../../utils/auth"
import gql from "graphql-tag"
import GuessInfo from "./GuessInfo"
import TeamInfo from "./TeamInfo"
import ChangeTurnButton from "./ChangeTurnButton"
import NextGameButton from "./NextGameButton"
import WordButton, {
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
import ActionButton from "../styled/ActionButton"

const DEFAULT_POLL_INTERVAL_MS = 1000
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
      nextDlonamesGameId
    }
  }
`

const isCurrentUserTurn = (username, blueTeam, redTeam, currentTeam) => {
  if (blueTeam.includes(username) && currentTeam === "blueTeam") return true
  if (redTeam.includes(username) && currentTeam === "redTeam") return true
  return false
}

const isUserOnATeam = (username, team1, team2) => {
  return team1.includes(username) || team2.includes(username)
}

const isCurrentUserCodemaster = (username, blueCodemaster, redCodemaster) => {
  return username === blueCodemaster || username === redCodemaster
}

const getNumCorrect = (words, wordsGuessed) => {
  let correct = 0
  words.forEach(word => {
    if (wordsGuessed.includes(word)) correct += 1
  })
  return correct
}

class DlonamesBoard extends Component {
  render() {
    const currentUser = getUser()
    let gameId = this.props.gameId

    if (!gameId) {
      return (
        <Mutation
          mutation={CREATE_GAME_MUTATION}
          variables={{ creatorName: currentUser }}
        >
          {(createGame, { loading, error }) => {
            if (loading) return <p>Creating game...</p>
            if (error) return <p>Error: {error.message}</p>
            return (
              <React.Fragment>
                <h3 style={{ paddingTop: "2rem" }}>
                  Here's a list of things coming soon to dlonames:
                </h3>
                <ul>
                  <li>Displaying your codenames stats</li>
                  <li>Looking up other players' stats</li>
                  <li>Being able to start a new game after finishing a game</li>
                </ul>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActionButton
                    onClickHandler={async () => {
                      const createGameResponse = await createGame()
                      gameId = createGameResponse.data.createGame.id
                      navigate("/dlonames/game?" + gameIdQuery + "=" + gameId)
                    }}
                    label="Create Game"
                    backgroundColor="grey"
                  />
                </div>
                <h3 style={{ paddingTop: "2rem" }}>
                  Reach out to me with any other ideas!
                </h3>
              </React.Fragment>
            )
          }}
        </Mutation>
      )
    }

    return (
      // TODO: Change the poll interval to be smaller closer to launch.
      <Query
        query={GET_GAME_QUERY}
        variables={{ id: gameId, username: currentUser }}
        pollInterval={DEFAULT_POLL_INTERVAL_MS}
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
            nextDlonamesGameId,
          } = data.game
          if (nextDlonamesGameId) {
            navigate("/dlonames/game?gid=" + nextDlonamesGameId)
          }
          const username = currentUser

          let guessInfoOrTeamWinInfo
          if (gameIsFinished) {
            const winningTeamColor =
              winningTeam === "redTeam" ? "#FF69B4" : "#50AEB5"

            guessInfoOrTeamWinInfo = (
              <p style={{ textAlign: "center", color: winningTeamColor }}>
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
                awaitRefetchQueries={true}
                refetchQueries={[
                  { query: GET_GAME_QUERY, variables: { id: gameId } },
                ]}
              >
                {(joinGame, { loading, error }) => {
                  if (loading) return <p>Joining game...</p>
                  if (error) return <p>Error: {error.message}</p>
                  return (
                    <React.Fragment>
                      <h3 style={{ paddingTop: "2rem" }}>
                        One day, we'll show who's currently in the game on this
                        screen!
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ActionButton
                          onClickHandler={async () => {
                            await joinGame()
                          }}
                          label="Join Game"
                          backgroundColor="grey"
                        />
                      </div>
                    </React.Fragment>
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
          const teamColor = currentTeam === "redTeam" ? "#FF69B4" : "#50AEB5"
          return (
            <React.Fragment>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "540px",
                  margin: "0 auto",
                }}
              >
                <strong
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingTop: "1rem",
                    color: teamColor,
                  }}
                >
                  <span>
                    <span style={{ color: "#50AEB5" }}>
                      {blueWords.length -
                        getNumCorrect(blueWords, wordsGuessed)}
                    </span>{" "}
                    <span style={{ color: "#61DAFB" }}>-</span>{" "}
                    <span style={{ color: "#FF69B4" }}>
                      {redWords.length - getNumCorrect(redWords, wordsGuessed)}
                    </span>
                  </span>
                  <span>
                    {currentTeam === "blueTeam" ? "Blue team's" : "Red team's"}{" "}
                    turn
                  </span>
                </strong>
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
                    isCurrentTeam={currentTeam === "blueTeam"}
                  />
                  <TeamInfo
                    teamColor={RED_TEAM_STRING}
                    codeMaster={redCodemaster}
                    teamMembers={redTeam}
                    id={gameId}
                    username={username}
                    isCurrentTeam={currentTeam === "redTeam"}
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
                  {rows}
                </div>
                <div>
                  <ChangeTurnButton
                    id={gameId}
                    shouldHide={
                      gameIsFinished ||
                      !clue ||
                      isCurrentUserCodemaster(
                        username,
                        blueCodemaster,
                        redCodemaster
                      ) ||
                      !isCurrentUserTurn(
                        username,
                        blueTeam,
                        redTeam,
                        currentTeam
                      )
                    }
                  />
                  <NextGameButton id={gameId} shouldHide={!gameIsFinished} />
                </div>
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
  if (wordsGuessed.includes(word)) {
    wordHasBeenGuessed = true
  }
  if (!gameIsFinished && !isCurrentUserCodemaster) {
    if (!wordHasBeenGuessed) return grayTranslucent
  }
  if (blueWords.includes(word)) {
    return wordHasBeenGuessed ? blue : blueTranslucent
  }
  if (redWords.includes(word)) {
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
          <WordButton
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
