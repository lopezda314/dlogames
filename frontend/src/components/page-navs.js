import { Link } from "gatsby"
import React from "react"

const PageNavs = () => (
  <React.Fragment>
    <Link
      to="/dlonames/game"
      style={{ color: "inherit" }}
      /* TODO: figure out how to get rid of className to enable react-burger-menu access to these nav items. */
      className="bm-item"
      activeStyle={{ color: "red" }}
    >
      DloNames
    </Link>
    <Link
      to="/d2lo4"
      style={{ color: "inherit" }}
      /* TODO: figure out how to get rid of className to enable react-burger-menu access to these nav items. */
      className="bm-item"
      activeStyle={{ color: "red" }}
    >
      D2lo4
    </Link>
    <Link
      to="/soon"
      style={{ color: "inherit" }}
      /* TODO: figure out how to get rid of className to enable react-burger-menu access to these nav items. */
      className="bm-item"
      activeStyle={{ color: "red" }}
    >
      Coming Soon
    </Link>
  </React.Fragment>
)

export default PageNavs
