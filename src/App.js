import GlobalStyle from "./styles/GlobalStyle";
import { ThemeContext } from "./context/ThemeContext";
import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Home from "./components/pages/Home";

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <Router>
      <GlobalStyle theme={theme} />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
