import React from "react"
import Layout from "../../components/layout"
import DlonamesBoard from "../../components/dlonames/DlonamesBoard"

const DlonamesBoardPage = props => {
  return (
    <Layout>
      <DlonamesBoard location={props.location} />
    </Layout>
  )
}

export default DlonamesBoardPage
