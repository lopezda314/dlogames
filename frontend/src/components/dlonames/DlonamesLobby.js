import React, { Component } from 'react';
import Form from '../styled/Form';
import { navigate } from 'gatsby';

class DlonamesLobby extends Component {
    state = {
        username: '',
        gameId: '',
    }

    handleChange = (e) => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({[name]: val});
    }

    render() {
        return (
            <Form onSubmit={e => {
                        e.preventDefault();

                        // Navigate to game page
                        navigate('/dlonames/game' , {
                            state: this.state,
                        })}}>
                <fieldset>
                    <label>
                        Name
                        <input type="text" name="username" id="username" placeholder="username" required onChange={this.handleChange} />
                    </label>
                    <label>
                        Game<br />
                        <input type="text" name="gameId" id="gameId" placeholder="game id" onChange={this.handleChange} />
                    </label>
                </fieldset>
                <button type="submit">
                    {this.state.gameId ? 'Join' : 'Start'}
                </button>
            </Form>
            // <DlonamesBoard />
        );
    }
}

export default DlonamesLobby;