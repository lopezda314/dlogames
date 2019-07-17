import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Button, { blue, red, black, gray } from '../styled/button';
import GuessInfo from './GuessInfo';
import TeamInfo from './TeamInfo';
import { gameIdQuery } from './DlonamesLobby';

export const BLUE_TEAM_STRING = 'Blue';
export const RED_TEAM_STRING = 'Red';

export const GET_GAME_QUERY = gql`
    query GET_GAME_QUERY(
        $id: ID!
    ) {   
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
`;

class DlonamesBoard extends Component {
    render() {
        const gameId = new URLSearchParams(this.props.location.search).get(gameIdQuery);

        return (
            // TODO: Change the poll interval to be smaller closer to launch.
            <Query query={GET_GAME_QUERY} variables={{id: gameId}} pollInterval={5000}>
                {({data, loading, error}) => {
                    if (loading) return <p>Loading game...</p>;
                    if (error) return <p>Error: ${error.message}</p>;

                    const { words, redCodemaster, blueCodemaster, redTeam, blueTeam, blueWords, redWords, deathWord, clue, numGuesses } = data.game;
                    return (
                        <React.Fragment>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-evenly',
                                padding: '.5rem'
                            }}>
                                <TeamInfo teamColor={BLUE_TEAM_STRING} codeMaster={blueCodemaster} teamMembers={blueTeam} />
                                <TeamInfo teamColor={RED_TEAM_STRING } codeMaster={redCodemaster} teamMembers={redTeam} />
                            </div>
                            <GuessInfo id={gameId} clue={clue} numGuesses={numGuesses}/>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                            }}>
                                {/* Refactor this to use context providers or hooks instead of big lists of props. */}
                                <Row words={words.slice(0, 5)} row={0} blueWords={blueWords} redWords={redWords} deathWord={deathWord} />
                                <Row words={words.slice(5, 10)} row={1} blueWords={blueWords} redWords={redWords} deathWord={deathWord} />
                                <Row words={words.slice(10, 15)} row={2} blueWords={blueWords} redWords={redWords} deathWord={deathWord} />
                                <Row words={words.slice(15, 20)} row={3} blueWords={blueWords} redWords={redWords} deathWord={deathWord} />
                                <Row words={words.slice(20, 25)} row={4} blueWords={blueWords} redWords={redWords} deathWord={deathWord} />
                            </div>
                        </React.Fragment>
                    );
                }}
            </Query>
        );
    }
}

const getColorForWord = (row, column, blueWords, redWords, deathWord) => {
    const indexForWord = (row * 5) + column; 
    if (new Set(blueWords).has(indexForWord)) {
        return blue;
    }
    if (new Set(redWords).has(indexForWord)) {
        return red;
    }
    if (indexForWord === deathWord) {
        return black;
    }
    return gray;
}

const Row = ({ words, row, blueWords, redWords, deathWord }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        paddingTop: '2vh',
    }}>
        <Button label={words[0]} onClickHandler={() => console.log(`pressed ${words[0]}`)} backgroundColor={getColorForWord(row, 0, blueWords, redWords, deathWord)} />  
        <Button label={words[1]} onClickHandler={() => console.log(`pressed ${words[1]}`)} backgroundColor={getColorForWord(row, 1, blueWords, redWords, deathWord)}/>  
        <Button label={words[2]} onClickHandler={() => console.log(`pressed ${words[2]}`)} backgroundColor={getColorForWord(row, 2, blueWords, redWords, deathWord)} />  
        <Button label={words[3]} onClickHandler={() => console.log(`pressed ${words[3]}`)} backgroundColor={getColorForWord(row, 3, blueWords, redWords, deathWord)} />  
        <Button label={words[4]} onClickHandler={() => console.log(`pressed ${words[4]}`)} backgroundColor={getColorForWord(row, 4, blueWords, redWords, deathWord)} />  
    </div>
)

export default DlonamesBoard;