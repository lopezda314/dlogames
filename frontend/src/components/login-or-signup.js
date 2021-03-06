import React, { Component } from "react"
import Form from "./styled/Form"
import { Mutation, ApolloConsumer } from "react-apollo"
import cryptojs from "crypto-js"
import gql from "graphql-tag"
import styled from "styled-components"
import { navigate } from "gatsby"
import { getDlonamesHistory } from "./../utils/history-helper"

const REGISTER_USER_MUTATION = gql`
  mutation REGISTER_USER_MUTATION(
    $username: String!
    $encryptedPasscode: String!
  ) {
    registerUser(username: $username, encryptedPasscode: $encryptedPasscode) {
      username
    }
  }
`

const LOGIN_USER_QUERY = gql`
  query LOGIN_USER_QUERY($username: String!, $encryptedPasscode: String!) {
    loginUser(username: $username, encryptedPasscode: $encryptedPasscode) {
      username
    }
  }
`

const AuthNav = styled.ul`
  margin: 0;
  padding: 0%;
  list-style-position: outside;
  list-style-image: none;
`

const AuthTab = styled.li`
  list-style: none;
  width: 50%;
  text-align: center;
`

const AuthButton = styled.button`
  background: none;
  color: inherit;
  padding: 0.5rem;
  text-decoration: none;
  -webkit-appearance: none;
  -moz-appearance: none;
`

const PasscodeButton = styled.button`
  background: none;
  border: 1px solid white;
  border-radius: 50%;
  color: inherit;
  font-size: 1rem;
  width: 3.5rem;
  height: 3.5rem;
  transition: background 250ms ease-in-out, transform 150ms ease;
  :active {
    background: gray;
    transform: scale(0.75);
    -webkit-transform: scale(0.75, 0.75);
  }
`

const PasscodeDelButton = styled.button`
  background: none;
  border: 1px solid white;
  color: inherit;
  font-size: 0.75rem;
  width: 2.5rem;
  height: 2rem;
  margin: 0.75rem 0.5rem;
  transition: background 250ms ease-in-out, transform 150ms ease;
  :active {
    background: gray;
    transform: scale(0.75);
    -webkit-transform: scale(0.75, 0.75);
  }
`

const signupStyles = {
  padding: "0.5rem 0.5rem",
  textAlign: "center",
}

const passcodeRow = {
  display: "flex",
  justifyContent: "space-around",
  margin: "1rem 0",
}

const submitStyle = {
  background: "gray",
  border: "0",
  color: "white",
  display: "block",
  fontSize: "1.5rem",
  fontWeight: "600",
  width: "100%",
  position: "fixed",
  bottom: "0",
  left: "0",
}

const PasscodeDisplayer = ({ passcode }) => (
  <div style={{ fontSize: "1rem", textAlign: "center" }}>
    <span style={{ visibility: "hidden" }}>*</span>
    {passcode.length >= 1 ? (passcode.length === 1 ? passcode[0] : "* \t") : ""}
    {passcode.length >= 2 ? (passcode.length === 2 ? passcode[1] : "* \t") : ""}
    {passcode.length >= 3 ? (passcode.length === 3 ? passcode[2] : "* \t") : ""}
    {passcode.length >= 4 ? (passcode.length === 4 ? passcode[3] : "* \t") : ""}
  </div>
)
class LoginOrSignup extends Component {
  state = {
    username: "",
    passcode: "",
    isLoginActive: true,
  }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === "number" ? parseFloat(value) : value
    this.setState({ [name]: val.replace(/\s/g, "") })
  }

  handlePasscodeButtonPress = num => {
    if (this.state.passcode.length === 4) return
    this.setState({ passcode: this.state.passcode + num })
  }

  handlePasscodeDelPress = () => {
    if (this.state.passcode.length === 0) return
    this.setState({
      passcode: this.state.passcode.slice(0, this.state.passcode.length - 1),
    })
  }

  render() {
    return (
      <Mutation
        mutation={REGISTER_USER_MUTATION}
        variables={{
          username: this.state.username,
          encryptedPasscode: cryptojs
            .SHA256(this.state.passcode)
            .toString(cryptojs.enc.Base64),
        }}
      >
        {(registerUser, { error }) => {
          if (error) return <p>Error: {error}</p>

          return (
            <ApolloConsumer>
              {client => {
                if (error) return <p>Error: {error}</p>
                return (
                  <div
                    style={{
                      paddingTop: "1.5rem",
                      maxWidth: "440px",
                      margin: "0 auto",
                    }}
                  >
                    <div role="navigation">
                      <AuthNav style={{ display: "flex" }}>
                        <AuthTab
                          style={
                            this.state.isLoginActive
                              ? {
                                  boxShadow: "0 2px 0 0 #5c666f",
                                  fontWeight: "800",
                                }
                              : {}
                          }
                        >
                          <AuthButton
                            onClick={() =>
                              this.setState({ isLoginActive: true })
                            }
                          >
                            Log In
                          </AuthButton>
                        </AuthTab>
                        <AuthTab
                          style={
                            !this.state.isLoginActive
                              ? {
                                  boxShadow: "0 2px 0 0 #5c666f",
                                  fontWeight: "800",
                                }
                              : {}
                          }
                        >
                          <AuthButton
                            onClick={() =>
                              this.setState({ isLoginActive: false })
                            }
                          >
                            Sign Up
                          </AuthButton>
                        </AuthTab>
                      </AuthNav>
                    </div>
                    <Form>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        value={this.state.username}
                        required
                        onChange={this.handleChange}
                      />
                      <div>
                        <PasscodeDisplayer passcode={this.state.passcode} />
                      </div>
                      <button
                        type="submit"
                        style={submitStyle}
                        onClick={async e => {
                          e.preventDefault()
                          let user
                          if (!this.state.isLoginActive) {
                            user = await registerUser()
                            localStorage.setItem(
                              "user",
                              user.data.registerUser.username
                            )
                          } else {
                            const { data } = await client.query({
                              query: LOGIN_USER_QUERY,
                              variables: {
                                username: this.state.username,
                                encryptedPasscode: cryptojs
                                  .SHA256(this.state.passcode)
                                  .toString(cryptojs.enc.Base64),
                              },
                            })
                            localStorage.setItem(
                              "user",
                              data.loginUser.username
                            )
                          }
                          navigate("/dlonames/game?gid=" + getDlonamesHistory())
                        }}
                      >
                        {this.state.isLoginActive ? "Log in" : "Sign up"}
                      </button>
                    </Form>
                    <div style={passcodeRow}>
                      <PasscodeButton
                        onClick={() => this.handlePasscodeButtonPress(1)}
                      >
                        1
                      </PasscodeButton>
                      <PasscodeButton
                        onClick={() => this.handlePasscodeButtonPress(2)}
                      >
                        2
                      </PasscodeButton>
                      <PasscodeButton
                        onClick={() => this.handlePasscodeButtonPress(3)}
                      >
                        3
                      </PasscodeButton>
                    </div>
                    <div style={passcodeRow}>
                      <PasscodeButton
                        onClick={() => this.handlePasscodeButtonPress(4)}
                      >
                        4
                      </PasscodeButton>
                      <PasscodeButton
                        onClick={() => this.handlePasscodeButtonPress(5)}
                      >
                        5
                      </PasscodeButton>
                      <PasscodeButton
                        onClick={() => this.handlePasscodeButtonPress(6)}
                      >
                        6
                      </PasscodeButton>
                    </div>
                    <div style={passcodeRow}>
                      <PasscodeButton
                        onClick={() => this.handlePasscodeButtonPress(7)}
                      >
                        7
                      </PasscodeButton>
                      <PasscodeButton
                        onClick={() => this.handlePasscodeButtonPress(8)}
                      >
                        8
                      </PasscodeButton>
                      <PasscodeButton
                        onClick={() => this.handlePasscodeButtonPress(9)}
                      >
                        9
                      </PasscodeButton>
                    </div>
                    <div style={passcodeRow}>
                      <PasscodeButton
                        style={{ visibility: "hidden" }}
                      ></PasscodeButton>
                      <PasscodeButton
                        onClick={() => this.handlePasscodeButtonPress(0)}
                      >
                        0
                      </PasscodeButton>
                      <PasscodeDelButton
                        onClick={() => this.handlePasscodeDelPress()}
                      >
                        X
                      </PasscodeDelButton>
                    </div>
                    <div
                      style={
                        this.state.isLoginActive
                          ? { display: "none" }
                          : signupStyles
                      }
                    >
                      <small>Enter a username and a four digit passcode.</small>{" "}
                    </div>
                  </div>
                )
              }}
            </ApolloConsumer>
          )
        }}
      </Mutation>
    )
  }
}

export default LoginOrSignup
