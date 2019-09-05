import React from "react"
import Layout from "../../components/layout"
import DlonamesBoard from "../../components/dlonames/DlonamesBoard"
import { login, isAuthenticated } from "../../utils/auth"

const DlonamesBoardPage = props => {
  if (!isAuthenticated()) {
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
