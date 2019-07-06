import React from 'react';
import styled from 'styled-components';

import {blueTeam, redTeam} from '../../pages/dlonames';

const StyledTeamInfo = styled.div`
    border: 1px solid white;
    border-radius: 8px;
    padding: .825rem 1.25rem;
    width: 45vw;
`;

const TeamInfo = ({team}) => (
    <StyledTeamInfo>
        <p style={{
            color: team === blueTeam ? '#FF69B4' : '#50AEB5',
        }}>{team} Team</p>
        <p>{team === blueTeam ? 'David' : 'Amanda'}</p>
    </StyledTeamInfo>
);

export default TeamInfo;