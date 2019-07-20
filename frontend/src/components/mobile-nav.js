import React from 'react';
import styled from 'styled-components';
import { slide as Menu } from "react-burger-menu";

import PageNavs from "./page-navs";

const StyledMobileNav = styled.div`
    /* Taken from react-burger-menu docs. */
    .bm-item {
        display: block;
        /* Our sidebar item styling */
        text-decoration: none;
        margin-bottom: 10px;
        color: #d1d1d1;
        transition: color 0.2s;
    }
    .bm-item:hover {
        color: white;
    }
    .bm-burger-button {
        position: fixed;
        width: 2.25rem;
        height: 1.875rem;
        left: 18px;
        top: 14px;
    }
    .bm-burger-bars {
        background: gray;
    }
    .bm-cross-button {
        height: 24px;
        width: 24px;
    }
    .bm-cross {
        background: #bdc3c7;
    }
    .bm-menu {
        background: #373a47;
        padding: 2.5em 1.5em 0;
        font-size: 1.15em;
    }
    .bm-item-list {
        color: #b8b7ad;
    }
    .bm-overlay {
        background: rgba(0, 0, 0, 0.3);
    }
    @media (min-width: 700px) {
        display: none;
    }
`;

const MobileNav = () => (
    <StyledMobileNav>
        <Menu>
            <PageNavs />
        </Menu>
    </StyledMobileNav>
);

export default MobileNav;