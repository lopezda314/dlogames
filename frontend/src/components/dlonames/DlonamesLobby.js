import React, { Component } from 'react';
import DlonamesBoard from './DlonamesBoard';
import Form from '../styled/Form';

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
            <Form>
                <fieldset>
                    <label>
                        Name
                        <input type="text" name="username" id="username" placeholder="username" required onChange={this.handleChange} />
                    </label>
                    <label>
                        Game<br />
                        Only for existing games
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