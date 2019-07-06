import React from "react"

import Button from '../components/button';
import Layout from "../components/layout";
import TeamInfo from '../components/dlonames/team-info';

export const blueTeam = 'Blue';
export const redTeam = 'Red';

const DlonamesPage = () => (
    <Layout>
        <div style={{
            display: 'flex',
            justifyContent: 'space-evenly',
        }}>
            <TeamInfo team={blueTeam} />
            <TeamInfo team={redTeam } />
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
        }}>
            <Row words={['dog', 'cat', 'bacon', 'banana', 'beep']} />
            <Row words={['dog', 'dog', 'bacon', 'banana', 'beep']} />
            <Row words={['dog', 'cat', 'dog', 'banana', 'beep']} />
            <Row words={['dog', 'cat', 'bacon', 'dog', 'beep']} />
            <Row words={['dog', 'cat', 'bacon', 'banana', 'dog']} />
        </div>
    </Layout>
);

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
export default DlonamesPage;