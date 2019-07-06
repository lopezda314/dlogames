import React from 'react';
import styled from 'styled-components';

import PageNavs from "./page-navs";

const StyledMobileNav = styled.div`
    display: flex;
    font-size: 1rem;
    justify-content: space-between;
    padding: 1rem 3rem;
    @media (min-width: 700px) {
        display: none;
    }
`;

const MobileNav = () => (
    <React.Fragment>
        <StyledMobileNav>
            <PageNavs />
        </StyledMobileNav>
    </React.Fragment>
);

export default MobileNav;