import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Button from '../styled/button';
import TeamInfo from './TeamInfo';
export const blueTeam = 'Blue';
export const redTeam = 'Red';

const GET_GAME_QUERY = gql`
    {   
        game(id: "cjy2fhw8drfev0b06z3t0mwvw") {
            blueCodemaster
            words
        }
    }
`;

class DlonamesBoard extends Component {
    render() {
        return (
            <Query query={GET_GAME_QUERY}>
                {({data, loading, error}) => {
                    if (loading) return <p>Loading game...</p>;
                    if (error) return <p>Error: ${error.message}</p>;

                    const { words, blueCodemaster } = data.game;
                    return (
                        <React.Fragment>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-evenly',
                            }}>
                                <TeamInfo team={blueTeam} codemaster={blueCodemaster} />
                                <TeamInfo team={redTeam } />
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-evenly',
                            }}>
                                <Row words={words.slice(0, 5)} />
                                <Row words={words.slice(5, 10)} />
                                <Row words={words.slice(10, 15)} />
                                <Row words={words.slice(15, 20)} />
                                <Row words={words.slice(20, 25)} />
                            </div>
                        </React.Fragment>
                    );
                }}
            </Query>
        );
    }
}

const Row = ({words}) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        paddingTop: '2vh',
    }}>
        <Button label={words[0]} onClickHandler={() => console.log(`pressed ${words[0]}`)} />  
        <Button label={words[1]} onClickHandler={() => console.log(`pressed ${words[1]}`)} />  
        <Button label={words[2]} onClickHandler={() => console.log(`pressed ${words[2]}`)} />  
        <Button label={words[3]} onClickHandler={() => console.log(`pressed ${words[3]}`)} />  
        <Button label={words[4]} onClickHandler={() => console.log(`pressed ${words[4]}`)} />  
    </div>
)

export default DlonamesBoard;