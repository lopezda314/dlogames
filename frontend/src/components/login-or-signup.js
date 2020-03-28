import React, { Component } from "react"
import Form from "./styled/Form"
import { Mutation, Query } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"

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
  font-size: 2rem;
  width: 60px;
  height: 60px;
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
  position: "absolute",
  bottom: "0",
  left: "0",
}

const Passcode = ({ value }) => <PasscodeButton>{value}</PasscodeButton>

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

  render() {
    return (
      <div
        style={{ paddingTop: "1.5rem", maxWidth: "440px", margin: "0 auto" }}
      >
        <div role="navigation">
          <AuthNav style={{ display: "flex" }}>
            <AuthTab
              style={
                this.state.isLoginActive
                  ? { boxShadow: "0 2px 0 0 #5c666f", fontWeight: "800" }
                  : {}
              }
            >
              <AuthButton
                onClick={() => this.setState({ isLoginActive: true })}
              >
                Log In
              </AuthButton>
            </AuthTab>
            <AuthTab
              style={
                !this.state.isLoginActive
                  ? { boxShadow: "0 2px 0 0 #5c666f", fontWeight: "800" }
                  : {}
              }
            >
              <AuthButton
                onClick={() => this.setState({ isLoginActive: false })}
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
          <input
            style={{ display: "none" }}
            type="password"
            name="passcode"
            id="passcode"
            value={this.state.passcode}
            required
            disabled
          />
          <button type="submit" style={submitStyle}>
            {this.state.isLoginActive ? "Log in" : "Sign up"}
          </button>
        </Form>
        <div style={passcodeRow}>
          <Passcode value={1} disabled={this.state.username === ""} />
          <Passcode value={2} disabled={this.state.username === ""} />
          <Passcode value={3} disabled={this.state.username === ""} />
        </div>
        <div style={passcodeRow}>
          <Passcode value={4} disabled={this.state.username === ""} />
          <Passcode value={5} disabled={this.state.username === ""} />
          <Passcode value={6} disabled={this.state.username === ""} />
        </div>
        <div style={passcodeRow}>
          <Passcode value={7} disabled={this.state.username === ""} />
          <Passcode value={8} disabled={this.state.username === ""} />
          <Passcode value={9} disabled={this.state.username === ""} />
        </div>
        <div style={passcodeRow}>
          <Passcode value={0} disabled={this.state.username === ""} />
        </div>
        <div
          style={this.state.isLoginActive ? { display: "none" } : signupStyles}
        >
          <small>Enter a username and a four digit passcode.</small> <br />
          <small>Dlogames will never collect any personal information.</small>
        </div>
      </div>
    )
  }
}

export default LoginOrSignup
