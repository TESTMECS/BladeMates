import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import Profile from "./components/Profile";
import { AuthProvider } from "./context/userContext";
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          {/* Private route using PrivateRoute component */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile/:username" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
