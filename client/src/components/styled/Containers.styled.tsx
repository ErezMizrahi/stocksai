import styled from "styled-components";

export const Grid = styled.div`
    display: grid;
    grid-template-rows: 70px 1fr;
    min-height: 100vh;
    gap: 10px;
`;

export const GridPadding = styled.div`
    padding: 0 24px;
`;

export const RowGap = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;

    &:hover {
        color: ${({ theme }) => theme.colors.red };
        cursor: pointer;
    }
`;

export const DashboardContainer = styled.div`
    display: grid;
    gap: 2em;
    grid-template-columns: repeat(5, 1fr);
   
`;


export const RowGrid = styled.div`
    display: flex;
    flex-direction: row;
    align-items: start;
    flex-wrap: wrap;
    gap: 10px;
`;