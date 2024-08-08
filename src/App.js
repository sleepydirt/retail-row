import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./views/HomePage";
import ListingAddPage from "./views/ListingAddPage";
import ListingEditPage from "./views/ListingEditPage";
import ListingPage from "./views/ListingPage";
import LoginPage from "./views/LoginPage";
import SignUpPage from "./views/SignUpPage";
import LandingPage from "./views/LandingPage";
import Profile from "./views/Profile";
import Chat from "./views/Chat";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/add" element={<ListingAddPage />} />
        <Route path="/onboard" element={<LandingPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/update/:id" element={<ListingEditPage />} />
        <Route path="/posts/:id" element={<ListingPage />} />
        <Route path="/profile/" element={<Profile />} />
        <Route path="/chats/:chatId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
