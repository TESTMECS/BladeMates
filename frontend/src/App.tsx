import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import MainFeed from "./components/MainFeed";
import LoginPage from "./components/LoginPage";
import Profile from "./components/Profile";
import { AuthProvider } from "./context/userContext";
import ArticlesPage from "./components/ArticlesPage";
import TrendList from "./components/TrendList";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          {/* Private route using PrivateRoute component */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/home" element={<MainFeed />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/articles/:id" element={<ArticlesPage />} />
            <Route path="/trends" element={<TrendList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
