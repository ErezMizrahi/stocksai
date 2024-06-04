import styled from "styled-components";

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const InputContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

export const SearchResultsContainer = styled.ul`
    border-radius: 5px;
    border: 1px solid #ccc;
    list-style: none;
    padding: 20px;
    max-height: 200px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
    
    & li {
        padding: 0px 0px 5px 0px;

        &:nth-child(n) {
            border-bottom: 1px solid #ccc;
        }

        &:nth-last-child(1) {
            border-bottom: none;
        }
    }

  
`;