import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./views/HomePage";
import ListingAddPage from "./views/ListingAddPage";
import ListingEditPage from "./views/ListingEditPage";
import ListingPage from "./views/ListingPage";
import LoginPage from "./views/LoginPage";
import SignUpPage from "./views/SignUpPage";
import LandingPage from "./views/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/add" element={<ListingAddPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/update/:id" element={<ListingEditPage />} />
        <Route path="/posts/:id" element={<ListingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
