import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import styled from 'styled-components';

import Nav from './nav';

const Logo = styled.h1`
    font-size: 3rem;
    margin: 0;
    position: relative;
    text-align: end;
    z-index: 2;
    a {
        padding: 0.5rem 1rem;
        text-decoration: none;
    }
`;

const StyledHeader = styled.header`
    .bar {
        display: grid;
        grid-template-columns: auto 1fr;
        justify-content: space-between;
        align-items: stretch;
        @media (max-width: 1300px) {
            grid-template-columns: 1fr;
            justify-content: center; 
        }
    }
`;

const Header = ({ siteTitle }) => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link
          to="/"
          style={{
            textDecoration: `none`,
            color: 'inherit',
          }}>
          {siteTitle}
        </Link>
      </Logo>
      <Nav />
    </div>
  </StyledHeader>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
