import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body{
        font-family: 'Poppins', sans-serif;
        height: 100vh;
        background: ${(props) => (props.theme == "dark" ? "#1B264F" : "#fff")};
        color: ${(props) => (props.theme == "dark" ? "#fff" : "#000")}
    }
`;

export default GlobalStyle;
