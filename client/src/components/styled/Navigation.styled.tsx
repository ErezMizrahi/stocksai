import styled from "styled-components";

export const NavBar = styled.nav`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
`;

export const NavigationList = styled.ul`
    display: flex;
    gap: 10;

    & a {
        color: black;
        text-decoration: none;

        &:hover {
            font-weight: bold;
        }
    }
`;