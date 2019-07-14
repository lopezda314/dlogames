import React from 'react';
import styled from 'styled-components';

import { blueTeam } from './DlonamesBoard';

const StyledTeamInfo = styled.div`
    border: 1px solid white;
    border-radius: 8px;
    padding: .825rem 1.25rem;
    width: 45vw;
`;

const TeamInfo = ({team, codeMaster}) => (
    <StyledTeamInfo style={{
        color: team === blueTeam ? '#50AEB5' : '#FF69B4',
    }}>
        <p>{team} Team</p>
        <p>{codeMaster}</p>
    </StyledTeamInfo>
);

export default TeamInfo;