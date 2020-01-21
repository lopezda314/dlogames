import React from "react"
import Layout from "../../components/layout"
import DlonamesBoard from "../../components/dlonames/DlonamesBoard"
import { login, isAuthenticated } from "../../utils/auth"
import { setDlonamesHistory, gameIdQuery } from "../../utils/history-helper"

const DlonamesBoardPage = props => {
  const gameId = new URLSearchParams(props.location.search).get(gameIdQuery)

  if (!isAuthenticated()) {
    if (gameId) {
      // User was shared game via link but isn't logged in.
      // Let's redirect them back to the game after login.
      setDlonamesHistory(gameId)
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
