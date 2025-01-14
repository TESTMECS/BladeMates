import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import MainFeed from "./components/MainFeed";
import LoginPage from "./components/Landing/LoginPage";
import Profile from "./components/Profile";
import { useAuth } from "./context/userContext";
import ArticlesPage from "./components/Articles/ArticlesPage";
import LiveChat from "./components/Articles/LiveChat";
// import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/outline";

const App: React.FC = () => {
  // const [darkMode, setDarkMode] = useState<boolean>(false);
  // useEffect(() => {
  //   if (darkMode) {
  //     document.body.classList.add("dark");
  //   } else {
  //     document.body.classList.remove("dark");
  //   }
  // }, [darkMode]);
  const { darkMode, toggleDarkMode } = useAuth();
  return (
    <Router>
      <div
        className={
          darkMode
            ? "dark dark:bg-darkblue dark:text-white"
            : "bg-beige text-black"
        }
      >
        <button
          className="absolute top-4 right-4 bg-darkblue text-white dark:text-black dark:bg-beige px-4 py-2 rounded-md z-10"
          onClick={() => toggleDarkMode()}
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>

        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          {/* Private route using PrivateRoute component */}
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/home" element={<MainFeed />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/articles/:id" element={<ArticlesPage />} />
            <Route path="/live/:id" element={<LiveChat />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
