import React from "react"
import Layout from "../../components/layout"
import DlonamesBoard from "../../components/dlonames/DlonamesBoard"
import { login, isAuthenticated } from "../../utils/auth"
import { gameIdQuery } from "../../components/dlonames/DlonamesLobby"

const DlonamesBoardPage = props => {
  if (!isAuthenticated()) {
    const gameId = new URLSearchParams(props.location.search).get(gameIdQuery)
    let dlogamesHistory
    if (localStorage.getItem("dlogamesHistory")) {
      dlogamesHistory = JSON.parse(localStorage.getItem("dlogamesHistory"))
    } else {
      dlogamesHistory = { dlonames: gameId }
    }
    localStorage.setItem("dlogamesHistory", JSON.stringify(dlogamesHistory))
    login()
    return <p>Redirecting to login...</p>
  }

  return (
    <Layout>
      <DlonamesBoard location={props.location} />
    </Layout>
  )
}

export default DlonamesBoardPage
