import React, { Component } from "react";
import styled from 'styled-components';

const GuessForm = styled.form`
    padding: 0 .75rem;
    div[role="group"] {
        border: 0;
        display: flex;
        justify-content: space-evenly;
        margin-bottom: 0.5rem;
    }
    input {
        width: 30vw;
    }
    button[type='submit'] {
        background: gray;
        border: 0;
        border-radius: 8px;
        color: white;
        display: block;
        font-size: 1.5rem;
        font-weight: 600;
        margin: 10px auto 0;
        width: 130px;
    }
`;

class GuessInfo extends Component {

    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({[name]: val});
    } 

    render() {
        return (
            <GuessForm>
                <div role="group">
                    <input type="text" name="clue" id="clue" placeholder="clue" required onChange={this.handleChange} />
                    <span>for</span>
                    <input type="number" name="numGuesses" id="numGuesses" placeholder="# guesses" required onChange={this.handleChange} />
                </div>
                <button type="submit">
                    Submit Clue
                </button>
            </GuessForm>
        );
    }
}

export default GuessInfo;