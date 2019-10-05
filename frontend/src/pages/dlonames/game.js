import React from "react"
import Layout from "../../components/layout"
import DlonamesBoard, { gameIdQuery } from "../../components/dlonames/DlonamesBoard"
import { login, isAuthenticated } from "../../utils/auth"

const DlonamesBoardPage = props => {
  debugger;
  const gameId = new URLSearchParams(props.location.search).get(gameIdQuery)

  if (!isAuthenticated()) {
    let dlogamesHistory = {}
    if (localStorage.getItem("dlogamesHistory")) {
      dlogamesHistory = JSON.parse(localStorage.getItem("dlogamesHistory"))
    }
    if (gameId) {
      // User was shared game via link but isn't logged in.
      // Let's redirect them back to the game after login.
      dlogamesHistory.dlonames = gameId
      localStorage.setItem("dlogamesHistory", JSON.stringify(dlogamesHistory))
    }

    login()
    return <p>Redirecting to login...</p>
  }

  return (
    <Layout>
      <DlonamesBoard gameId={gameId} />
    </Layout>
  )
}

export default DlonamesBoardPage
