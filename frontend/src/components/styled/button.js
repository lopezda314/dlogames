import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
    background: whitesmoke;
    border-radius: 8px;
    color: #393939;
    font-size: 1rem;
    height: 48px;
    width: 18%;
`;

const Button = ({label, onClickHandler}) => (
    <StyledButton onClick={onClickHandler}>
        {label}
    </StyledButton>
);

export default Button;