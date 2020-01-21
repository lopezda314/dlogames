import React from "react"
import { ApolloProvider } from "react-apollo"
import { client } from "./src/apollo/client"
import { silentAuth } from "./src/utils/auth"
import { setDlonamesHistory, gameIdQuery } from "./src/utils/history-helper"

class SessionCheck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
    this.gid = new URLSearchParams(window.location.search).get(gameIdQuery)
  }

  handleCheckSession = () => {
    this.setState({ loading: false })
  }

  componentDidMount() {
    if (this.gid) {
      setDlonamesHistory(this.gid)
    }
    silentAuth(this.handleCheckSession)
  }

  render() {
    return (
      this.state.loading === false && (
        <React.Fragment>{this.props.children}</React.Fragment>
      )
    )
  }
}

export const wrapRootElement = ({ element }) => (
  <SessionCheck>
    <ApolloProvider client={client}>{element}</ApolloProvider>
  </SessionCheck>
)
