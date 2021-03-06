import React from "react"
import styled from "styled-components"

import PageNavs from "./page-navs"

const NavStyles = styled.div`
  display: flex;
  font-size: 1.5rem;
  justify-content: center;
  justify-self: end;
  margin: 0;
  padding: 0;
  width: 100%;
  @media (max-width: 700px) {
    display: none;
  }
  a,
  button {
    padding: 1rem 3rem;
    display: flex;
    align-items: center;
    position: relative;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 1em;
    background: none;
    border: 0;
    cursor: pointer;
    @media (max-width: 700px) {
      font-size: 10px;
      padding: 0 10px;
    }
    &:after {
      height: 2px;
      background: red;
      content: "";
      width: 0;
      position: absolute;
      transform: translateX(-50%);
      transition: width 0.4s;
      transition-timing-function: cubic-bezier(1, -0.65, 0, 2.31);
      left: 50%;
      margin-top: 1rem;
    }
    &:hover,
    &:focus {
      outline: none;
      &:after {
        width: calc(100% - 60px);
      }
      @media (max-width: 700px) {
        width: calc(100% - 10px);
      }
    }
  }
`

const Nav = () => (
  <NavStyles>
    <PageNavs />
  </NavStyles>
)

export default Nav
