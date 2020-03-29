import React from "react"
import { ApolloProvider } from "react-apollo"
import { client } from "./src/apollo/client"
import { setDlonamesHistory, gameIdQuery } from "./src/utils/history-helper"

class SessionCheck extends React.Component {
  constructor(props) {
    super(props)
    this.gid = new URLSearchParams(window.location.search).get(gameIdQuery)
  }

  componentDidMount() {
    if (this.gid) {
      setDlonamesHistory(this.gid)
    }
  }

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}

export const wrapRootElement = ({ element }) => (
  <SessionCheck>
    <ApolloProvider client={client}>{element}</ApolloProvider>
  </SessionCheck>
)
