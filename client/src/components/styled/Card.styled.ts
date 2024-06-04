"use client";
import styled from "styled-components";




export const Card = styled.div`
    padding: 20px;
    border-radius: 5px;
    background-color: ${props => props.theme.colors.light};
    color: ${props => props.theme.colors.dark};
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
    gap: 10px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    * {
        color: ${props => props.theme.colors.primary};
    }

    p {
        text-align: cetner;
        font-size: 0.8em;
    }
`;