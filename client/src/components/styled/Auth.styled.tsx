import styled from "styled-components";

export const Container = styled.div`
    background-color: ${({ theme }) => theme.colors.light };
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    

    & > form {
        background-color: white;
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        padding: 20px;
        border-radius: 10px;
        height: 300px;
        width: 300px;
        text-align: center;
        & > h1 {
            margin-top: 0;
        }

       & > .input-container {
        width: 100%;
        & > input {
                width: 60%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }

        & > .error {
            color: #a30000;
            font-size: 0.8rem;
        }

       }
        
        & > button {
            width: 60%;
            padding: 10px;
            border: none;
            border-radius: 5px;
            background-color: ${({ theme }) => theme.colors.dark};
            color: white;
            cursor: pointer;
        }
    }
`;