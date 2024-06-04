import styled from "styled-components";

export const ChipsUL = styled.ul`
    list-style: none;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 18px;
    padding: 0;

    li {
        cursor: pointer;


        span {
            background-color: lightgray;
            padding: 5px 10px;
            border-radius: 10px;
            display: flex;
            gap: 5px;
            justify-content: center;
            align-items: center;
            font-weight: bold;
        }
    }
`;